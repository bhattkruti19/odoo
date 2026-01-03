from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import User, PayrollRecord
from schemas import PayrollRecordCreate, PayrollRecordResponse, PayrollRecordUpdate
from auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/api/payroll", tags=["Payroll"])


@router.post("/", response_model=PayrollRecordResponse, status_code=status.HTTP_201_CREATED)
def create_payroll_record(
    payroll_data: PayrollRecordCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new payroll record (Admin only)"""
    # Check if user exists
    user = db.query(User).filter(User.id == payroll_data.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if payroll record already exists for this month/year
    existing = db.query(PayrollRecord).filter(
        PayrollRecord.user_id == payroll_data.user_id,
        PayrollRecord.month == payroll_data.month,
        PayrollRecord.year == payroll_data.year
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payroll record already exists for {payroll_data.month}/{payroll_data.year}"
        )
    
    # Create payroll record
    payroll = PayrollRecord(
        user_id=payroll_data.user_id,
        month=payroll_data.month,
        year=payroll_data.year,
        base_salary=payroll_data.base_salary,
        allowances=payroll_data.allowances,
        deductions=payroll_data.deductions,
        bonus=payroll_data.bonus,
        tax=payroll_data.tax,
        net_salary=payroll_data.net_salary,
        payment_date=payroll_data.payment_date,
        payment_method=payroll_data.payment_method,
        notes=payroll_data.notes
    )
    
    db.add(payroll)
    db.commit()
    db.refresh(payroll)
    return payroll


@router.get("/my-records", response_model=List[PayrollRecordResponse])
def get_my_payroll_records(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    year: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's payroll records"""
    query = db.query(PayrollRecord).filter(
        PayrollRecord.user_id == current_user.id
    )
    
    # Apply year filter
    if year:
        query = query.filter(PayrollRecord.year == year)
    
    records = query.order_by(
        PayrollRecord.year.desc(),
        PayrollRecord.month.desc()
    ).offset(skip).limit(limit).all()
    
    return records


@router.get("/all", response_model=List[PayrollRecordResponse])
def get_all_payroll_records(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    user_id: Optional[int] = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all payroll records (Admin only)"""
    query = db.query(PayrollRecord)
    
    # Apply filters
    if user_id:
        query = query.filter(PayrollRecord.user_id == user_id)
    if month:
        query = query.filter(PayrollRecord.month == month)
    if year:
        query = query.filter(PayrollRecord.year == year)
    
    records = query.order_by(
        PayrollRecord.year.desc(),
        PayrollRecord.month.desc()
    ).offset(skip).limit(limit).all()
    
    return records


@router.get("/{record_id}", response_model=PayrollRecordResponse)
def get_payroll_record(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get payroll record by ID"""
    record = db.query(PayrollRecord).filter(PayrollRecord.id == record_id).first()
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payroll record not found"
        )
    
    # Check if user has permission
    if current_user.role != "admin" and record.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this record"
        )
    
    return record


@router.put("/{record_id}", response_model=PayrollRecordResponse)
def update_payroll_record(
    record_id: int,
    record_update: PayrollRecordUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update payroll record (Admin only)"""
    record = db.query(PayrollRecord).filter(PayrollRecord.id == record_id).first()
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payroll record not found"
        )
    
    # Update fields
    if record_update.base_salary is not None:
        record.base_salary = record_update.base_salary
    if record_update.allowances is not None:
        record.allowances = record_update.allowances
    if record_update.deductions is not None:
        record.deductions = record_update.deductions
    if record_update.bonus is not None:
        record.bonus = record_update.bonus
    if record_update.tax is not None:
        record.tax = record_update.tax
    if record_update.net_salary is not None:
        record.net_salary = record_update.net_salary
    if record_update.payment_date is not None:
        record.payment_date = record_update.payment_date
    if record_update.payment_method is not None:
        record.payment_method = record_update.payment_method
    if record_update.notes is not None:
        record.notes = record_update.notes
    
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_payroll_record(
    record_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete payroll record (Admin only)"""
    record = db.query(PayrollRecord).filter(PayrollRecord.id == record_id).first()
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payroll record not found"
        )
    
    db.delete(record)
    db.commit()
    return None


@router.get("/user/{user_id}/latest", response_model=PayrollRecordResponse)
def get_latest_payroll(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get latest payroll record for a user"""
    # Check permission
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this record"
        )
    
    record = db.query(PayrollRecord).filter(
        PayrollRecord.user_id == user_id
    ).order_by(
        PayrollRecord.year.desc(),
        PayrollRecord.month.desc()
    ).first()
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No payroll records found"
        )
    
    return record
