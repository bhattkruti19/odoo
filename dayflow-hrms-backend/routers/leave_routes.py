from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from database import get_db
from models import User, LeaveRequest
from schemas import LeaveRequestCreate, LeaveRequestResponse, LeaveRequestUpdate
from auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/api/leave", tags=["Leave Management"])


@router.post("/", response_model=LeaveRequestResponse, status_code=status.HTTP_201_CREATED)
def create_leave_request(
    leave_data: LeaveRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new leave request"""
    # Validate dates
    if leave_data.end_date < leave_data.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date must be after start date"
        )
    
    # Create leave request
    leave_request = LeaveRequest(
        user_id=current_user.id,
        leave_type=leave_data.leave_type,
        start_date=leave_data.start_date,
        end_date=leave_data.end_date,
        reason=leave_data.reason,
        status="pending"
    )
    
    db.add(leave_request)
    db.commit()
    db.refresh(leave_request)
    return leave_request


@router.get("/my-requests", response_model=List[LeaveRequestResponse])
def get_my_leave_requests(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's leave requests"""
    query = db.query(LeaveRequest).filter(
        LeaveRequest.user_id == current_user.id
    )
    
    # Apply status filter
    if status:
        query = query.filter(LeaveRequest.status == status)
    
    requests = query.order_by(LeaveRequest.created_at.desc()).offset(skip).limit(limit).all()
    return requests


@router.get("/all", response_model=List[LeaveRequestResponse])
def get_all_leave_requests(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    user_id: Optional[int] = None,
    status: Optional[str] = None,
    leave_type: Optional[str] = None,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all leave requests (Admin only)"""
    query = db.query(LeaveRequest)
    
    # Apply filters
    if user_id:
        query = query.filter(LeaveRequest.user_id == user_id)
    if status:
        query = query.filter(LeaveRequest.status == status)
    if leave_type:
        query = query.filter(LeaveRequest.leave_type == leave_type)
    
    requests = query.order_by(LeaveRequest.created_at.desc()).offset(skip).limit(limit).all()
    return requests


@router.get("/{request_id}", response_model=LeaveRequestResponse)
def get_leave_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get leave request by ID"""
    leave_request = db.query(LeaveRequest).filter(LeaveRequest.id == request_id).first()
    
    if not leave_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found"
        )
    
    # Check if user has permission
    if current_user.role != "admin" and leave_request.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this request"
        )
    
    return leave_request


@router.put("/{request_id}", response_model=LeaveRequestResponse)
def update_leave_request(
    request_id: int,
    request_update: LeaveRequestUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update leave request status (Admin only)"""
    leave_request = db.query(LeaveRequest).filter(LeaveRequest.id == request_id).first()
    
    if not leave_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found"
        )
    
    # Update fields
    if request_update.status is not None:
        leave_request.status = request_update.status
        leave_request.approved_by = current_user.id
    if request_update.admin_notes is not None:
        leave_request.admin_notes = request_update.admin_notes
    
    db.commit()
    db.refresh(leave_request)
    return leave_request


@router.post("/{request_id}/approve", response_model=LeaveRequestResponse)
def approve_leave_request(
    request_id: int,
    admin_notes: Optional[str] = None,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Approve a leave request (Admin only)"""
    leave_request = db.query(LeaveRequest).filter(LeaveRequest.id == request_id).first()
    
    if not leave_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found"
        )
    
    if leave_request.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only approve pending requests"
        )
    
    leave_request.status = "approved"
    leave_request.approved_by = current_user.id
    if admin_notes:
        leave_request.admin_notes = admin_notes
    
    db.commit()
    db.refresh(leave_request)
    return leave_request


@router.post("/{request_id}/reject", response_model=LeaveRequestResponse)
def reject_leave_request(
    request_id: int,
    admin_notes: Optional[str] = None,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Reject a leave request (Admin only)"""
    leave_request = db.query(LeaveRequest).filter(LeaveRequest.id == request_id).first()
    
    if not leave_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found"
        )
    
    if leave_request.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only reject pending requests"
        )
    
    leave_request.status = "rejected"
    leave_request.approved_by = current_user.id
    if admin_notes:
        leave_request.admin_notes = admin_notes
    
    db.commit()
    db.refresh(leave_request)
    return leave_request


@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_leave_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete leave request"""
    leave_request = db.query(LeaveRequest).filter(LeaveRequest.id == request_id).first()
    
    if not leave_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found"
        )
    
    # Only allow user to delete their own pending requests or admin to delete any
    if current_user.role != "admin" and (
        leave_request.user_id != current_user.id or leave_request.status != "pending"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this request"
        )
    
    db.delete(leave_request)
    db.commit()
    return None
