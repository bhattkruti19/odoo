from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from datetime import timedelta
from secrets import choice
import string
from database import get_db
from models import User, UserRole, MasterEmployee
from schemas import (
    UserCreate,
    UserResponse,
    Token,
    LoginRequest,
    AuthResponse,
    AdminCreateUserRequest,
    AdminCreateUserResponse,
    ChangePasswordRequest,
    AdminResetPasswordResponse,
)
from auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_user_by_email,
    get_current_admin_user,
    get_current_user,
)
from config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


def _generate_login_id(db: Session, first_name: str, last_name: str, joining_year: int) -> tuple[str, int]:
    prefix = settings.COMPANY_PREFIX or "OI"
    fn = (first_name or "").strip()[:2].upper().ljust(2, "X")
    ln = (last_name or "").strip()[:2].upper().ljust(2, "X")
    # Find next serial for the year
    current_max = db.query(func.max(User.joining_serial)).filter(User.joining_year == joining_year).scalar()
    next_serial = (current_max or 0) + 1
    login_id = f"{prefix}{fn}{ln}{joining_year}{next_serial:04d}"
    return login_id, next_serial


def _generate_temp_password(length: int = 12) -> str:
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*()"  # simple strong set
    return "".join(choice(alphabet) for _ in range(length))


@router.post("/register", status_code=status.HTTP_403_FORBIDDEN)
def register_disabled():
    """Public self-registration is disabled; admin must create accounts."""
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Self-registration is disabled. Please contact your administrator."
    )


@router.post("/admin/create-user", response_model=AdminCreateUserResponse, status_code=status.HTTP_201_CREATED)
def admin_create_user(
    payload: AdminCreateUserRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin_user),
):
    """Admin-only endpoint to create user with generated login_id and temp password."""
    joining_year = payload.date_of_joining.year
    login_id, joining_serial = _generate_login_id(db, payload.first_name, payload.last_name, joining_year)

    # uniqueness checks
    if db.query(User).filter(or_(User.login_id == login_id, User.email == payload.email)).first():
        raise HTTPException(status_code=400, detail="User with same login_id or email already exists")

    temp_password = _generate_temp_password()
    hashed_password = get_password_hash(temp_password)
    full_name = f"{payload.first_name} {payload.last_name}".strip()

    # create master employee record (keeps pre-approval ledger)
    master_emp = MasterEmployee(
        employee_id=login_id,
        work_email=payload.email,
        first_name=payload.first_name,
        last_name=payload.last_name,
        date_of_joining=payload.date_of_joining,
        joining_year=joining_year,
        joining_serial=joining_serial,
        role=payload.role,
        is_registered=True,
    )
    db.add(master_emp)
    db.flush()

    db_user = User(
        master_employee_id=master_emp.id,
        login_id=login_id,
        email=payload.email,
        hashed_password=hashed_password,
        full_name=full_name,
        first_name=payload.first_name,
        last_name=payload.last_name,
        date_of_joining=payload.date_of_joining,
        joining_year=joining_year,
        joining_serial=joining_serial,
        role=payload.role,
        employee_id=login_id,
        department=payload.department,
        position=payload.position,
        must_change_password=True,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db.refresh(master_emp)

    return AdminCreateUserResponse(user=db_user, temp_password=temp_password)


@router.post("/login", response_model=AuthResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login with login_id or email and get access token"""
    identifier = login_data.login
    user = db.query(User).filter(
        or_(User.login_id == identifier, User.email == identifier)
    ).first()

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }


@router.post("/change-password-first", response_model=UserResponse)
def change_password_first(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Change password on first login and clear must_change_password flag."""
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    current_user.hashed_password = get_password_hash(payload.new_password)
    current_user.must_change_password = False
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/logout")
def logout():
    """Logout user (client-side token removal)"""
    return {"message": "Successfully logged out"}


@router.post("/admin/reset-password/{user_id}", response_model=AdminResetPasswordResponse)
def admin_reset_password(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin_user),
):
    """Admin-only endpoint to reset a user's password and generate new temp password."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Generate new temp password
    temp_password = _generate_temp_password()
    user.hashed_password = get_password_hash(temp_password)
    user.must_change_password = True
    
    db.commit()
    db.refresh(user)
    
    return AdminResetPasswordResponse(user=user, temp_password=temp_password)
