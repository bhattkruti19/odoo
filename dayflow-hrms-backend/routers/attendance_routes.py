from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date
from database import get_db
from models import User, AttendanceRecord
from schemas import AttendanceRecordCreate, AttendanceRecordResponse, AttendanceRecordUpdate, AttendanceStats
from auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])


@router.post("/check-in", response_model=AttendanceRecordResponse, status_code=status.HTTP_201_CREATED)
def check_in(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check in for today"""
    today = date.today()
    
    # Check if already checked in today
    existing = db.query(AttendanceRecord).filter(
        AttendanceRecord.user_id == current_user.id,
        AttendanceRecord.date == today
    ).first()
    
    if existing and existing.check_in:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already checked in today"
        )
    
    if existing:
        # Update existing record
        existing.check_in = datetime.now()
        existing.status = "present"
        db.commit()
        db.refresh(existing)
        return existing
    else:
        # Create new record
        attendance = AttendanceRecord(
            user_id=current_user.id,
            date=today,
            check_in=datetime.now(),
            status="present"
        )
        db.add(attendance)
        db.commit()
        db.refresh(attendance)
        return attendance


@router.post("/check-out", response_model=AttendanceRecordResponse)
def check_out(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check out for today"""
    today = date.today()
    
    # Get today's attendance record
    attendance = db.query(AttendanceRecord).filter(
        AttendanceRecord.user_id == current_user.id,
        AttendanceRecord.date == today
    ).first()
    
    if not attendance or not attendance.check_in:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must check in before checking out"
        )
    
    if attendance.check_out:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already checked out today"
        )
    
    # Update check out time
    attendance.check_out = datetime.now()
    db.commit()
    db.refresh(attendance)
    return attendance


@router.get("/my-records", response_model=List[AttendanceRecordResponse])
def get_my_attendance_records(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's attendance records"""
    query = db.query(AttendanceRecord).filter(
        AttendanceRecord.user_id == current_user.id
    )
    
    # Apply date filters
    if start_date:
        query = query.filter(AttendanceRecord.date >= start_date)
    if end_date:
        query = query.filter(AttendanceRecord.date <= end_date)
    
    records = query.order_by(AttendanceRecord.date.desc()).offset(skip).limit(limit).all()
    return records


@router.get("/my-stats", response_model=AttendanceStats)
def get_my_attendance_stats(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's attendance statistics"""
    query = db.query(AttendanceRecord).filter(
        AttendanceRecord.user_id == current_user.id
    )
    
    if start_date:
        query = query.filter(AttendanceRecord.date >= start_date)
    if end_date:
        query = query.filter(AttendanceRecord.date <= end_date)
    
    records = query.all()
    total_days = len(records)
    present_days = len([r for r in records if r.status == "present"])
    absent_days = len([r for r in records if r.status == "absent"])
    late_days = len([r for r in records if r.status == "late"])
    
    attendance_rate = (present_days / total_days * 100) if total_days > 0 else 0.0
    
    return {
        "total_days": total_days,
        "present_days": present_days,
        "absent_days": absent_days,
        "late_days": late_days,
        "attendance_rate": round(attendance_rate, 2)
    }


@router.get("/all", response_model=List[AttendanceRecordResponse])
def get_all_attendance_records(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    user_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    status: Optional[str] = None,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all attendance records (Admin only)"""
    query = db.query(AttendanceRecord)
    
    # Apply filters
    if user_id:
        query = query.filter(AttendanceRecord.user_id == user_id)
    if start_date:
        query = query.filter(AttendanceRecord.date >= start_date)
    if end_date:
        query = query.filter(AttendanceRecord.date <= end_date)
    if status:
        query = query.filter(AttendanceRecord.status == status)
    
    records = query.order_by(AttendanceRecord.date.desc()).offset(skip).limit(limit).all()
    return records


@router.get("/{record_id}", response_model=AttendanceRecordResponse)
def get_attendance_record(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get attendance record by ID"""
    record = db.query(AttendanceRecord).filter(AttendanceRecord.id == record_id).first()
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance record not found"
        )
    
    # Check if user has permission
    if current_user.role != "admin" and record.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this record"
        )
    
    return record


@router.put("/{record_id}", response_model=AttendanceRecordResponse)
def update_attendance_record(
    record_id: int,
    record_update: AttendanceRecordUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update attendance record (Admin only)"""
    record = db.query(AttendanceRecord).filter(AttendanceRecord.id == record_id).first()
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance record not found"
        )
    
    # Update fields
    if record_update.check_in is not None:
        record.check_in = record_update.check_in
    if record_update.check_out is not None:
        record.check_out = record_update.check_out
    if record_update.status is not None:
        record.status = record_update.status
    if record_update.notes is not None:
        record.notes = record_update.notes
    
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_attendance_record(
    record_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete attendance record (Admin only)"""
    record = db.query(AttendanceRecord).filter(AttendanceRecord.id == record_id).first()
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance record not found"
        )
    
    db.delete(record)
    db.commit()
    return None
