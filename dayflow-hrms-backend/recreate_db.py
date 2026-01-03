"""
Recreate database with fresh schema
"""
from database import engine, Base
from models import User, MasterEmployee, AttendanceRecord, LeaveRequest, PayrollRecord
import os
import time

# Delete old database if it exists
db_path = "dayflow_hrms.db"
if os.path.exists(db_path):
    try:
        os.remove(db_path)
        print(f"✓ Deleted old database: {db_path}")
    except PermissionError:
        print(f"⚠ Could not delete database (in use), trying to clear tables instead...")
        # Try to drop all tables instead
        try:
            Base.metadata.drop_all(bind=engine)
            print("✓ Dropped all existing tables")
        except Exception as e:
            print(f"Error dropping tables: {e}")
        time.sleep(1)

# Create all tables with new schema
Base.metadata.create_all(bind=engine)
print("✓ Created all tables with fresh schema")
print("\nTables created:")
for table in Base.metadata.sorted_tables:    print(f"  - {table.name}")