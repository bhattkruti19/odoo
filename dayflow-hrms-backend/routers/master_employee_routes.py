from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database import get_db
from models import MasterEmployee, UserRole
from schemas import (
    MasterEmployeeCreate,
    MasterEmployeeResponse,
    MasterEmployeeBulkRow,
    MasterEmployeeBulkResult,
)
from auth import get_current_admin_user

router = APIRouter(prefix="/api/master-employees", tags=["Master Employees"])


@router.post("/", response_model=MasterEmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_master_employee(
    payload: MasterEmployeeCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin_user),
):
    """Add a single pre-approved employee record (Admin only)."""
    existing = db.query(MasterEmployee).filter(
        or_(
            MasterEmployee.employee_id == payload.employee_id,
            MasterEmployee.work_email == payload.work_email,
        )
    ).first()

    if existing:
        if existing.is_registered:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee already registered; cannot modify master record",
            )
        # Update unregistered record to new details
        existing.work_email = payload.work_email
        existing.role = payload.role
        existing.first_name = payload.first_name
        existing.last_name = payload.last_name
        existing.date_of_joining = payload.date_of_joining
        existing.joining_year = payload.joining_year
        existing.joining_serial = payload.joining_serial
        db.commit()
        db.refresh(existing)
        return existing

    record = MasterEmployee(
        employee_id=payload.employee_id,
        work_email=payload.work_email,
        first_name=payload.first_name,
        last_name=payload.last_name,
        date_of_joining=payload.date_of_joining,
        joining_year=payload.joining_year,
        joining_serial=payload.joining_serial,
        role=payload.role,
        is_registered=False,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.post("/bulk-import", response_model=MasterEmployeeBulkResult)
def bulk_import_master_employees(
    rows: List[MasterEmployeeBulkRow],
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin_user),
):
    """Bulk import pre-approved employees from CSV/Excel (Admin only)."""
    inserted = skipped = updated = 0
    errors: List[str] = []

    for idx, row in enumerate(rows, start=1):
        try:
            existing = db.query(MasterEmployee).filter(
                or_(
                    MasterEmployee.employee_id == row.employee_id,
                    MasterEmployee.work_email == row.work_email,
                )
            ).first()

            if existing:
                if existing.is_registered:
                    skipped += 1
                    continue
                existing.employee_id = row.employee_id
                existing.work_email = row.work_email
                existing.role = row.role
                existing.first_name = row.first_name
                existing.last_name = row.last_name
                existing.date_of_joining = row.date_of_joining
                existing.joining_year = row.joining_year
                existing.joining_serial = row.joining_serial
                updated += 1
            else:
                record = MasterEmployee(
                    employee_id=row.employee_id,
                    work_email=row.work_email,
                    role=row.role,
                    first_name=row.first_name,
                    last_name=row.last_name,
                    date_of_joining=row.date_of_joining,
                    joining_year=row.joining_year,
                    joining_serial=row.joining_serial,
                    is_registered=False,
                )
                db.add(record)
                inserted += 1
        except Exception as e:  # brief error capture for bulk import
            errors.append(f"Row {idx}: {str(e)}")
            db.rollback()
    db.commit()
    return MasterEmployeeBulkResult(inserted=inserted, skipped=skipped, updated=updated, errors=errors)


@router.get("/", response_model=List[MasterEmployeeResponse])
def list_master_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    is_registered: bool | None = None,
    role: UserRole | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin_user),
):
    """List master employee records (Admin only)."""
    query = db.query(MasterEmployee)
    if is_registered is not None:
        query = query.filter(MasterEmployee.is_registered == is_registered)
    if role is not None:
        query = query.filter(MasterEmployee.role == role)
    if search:
        like = f"%{search}%"
        query = query.filter(
            or_(
                MasterEmployee.employee_id.ilike(like),
                MasterEmployee.work_email.ilike(like),
            )
        )
    return query.order_by(MasterEmployee.employee_id).offset(skip).limit(limit).all()
