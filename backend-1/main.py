from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import hashlib
import secrets
import jwt

from database import get_db, engine
from models import Base, User, PasswordReset
from schemas import UserRegister, UserLogin, ForgotPassword, ResetPassword, UserResponse, LoginResponse
from binance_api import binance_service

# Create database tables for AWS RDS
try:
    # For AWS RDS, we don't create database - it already exists
    # Just create tables
    Base.metadata.create_all(bind=engine)
    print("✅ AWS RDS Tables created successfully!")
    
except Exception as e:
    print(f"❌ AWS RDS setup failed: {e}")
    print("Check your RDS endpoint and credentials!")

app = FastAPI(title="User Authentication API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Settings
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hashlib.sha256(password.encode()).hexdigest() == hashed

def generate_reset_token() -> str:
    return secrets.token_urlsafe(32)

def validate_email(email: str) -> bool:
    import re
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(pattern, email) is not None

# 1. USER REGISTRATION API
@app.post("/register")
def register_user(user_data: UserRegister):
    print(f"REGISTRATION START: {user_data.username}")
    
    # Simple validation
    if len(user_data.username) < 3:
        return {"error": "Username must be at least 3 characters"}
    
    if "@" not in user_data.email or "." not in user_data.email:
        return {"error": "Invalid email format"}
    
    if len(user_data.password) < 6:
        return {"error": "Password must be at least 6 characters"}
    
    try:
        print("Connecting to database...")
        from database import SessionLocal
        db = SessionLocal()
        
        print("Checking if user exists...")
        existing = db.query(User).filter(User.username == user_data.username).first()
        if existing:
            db.close()
            return {"error": "Username already exists"}
        
        print("Creating password hash...")
        hashed_pwd = hash_password(user_data.password)
        
        print("Creating user record...")
        new_user = User(
            username=user_data.username,
            email=user_data.email,
            fullname=user_data.full_name,
            password_hash=hashed_pwd
        )
        
        print("Saving to database...")
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        db.close()
        
        print(f" SUCCESS! User {user_data.username} registered with ID: {new_user.id}")
        
        return {
            "success": True,
            "message": "Registration successful",
            "user": {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email,
                "full_name": new_user.fullname
            }
        }
        
    except Exception as e:
        print(f" ERROR: {str(e)}")
        return {"error": f"Database error: {str(e)}"}

# 2. LOGIN API
@app.post("/login")
def login_user(login_data: UserLogin):
    print(f" Login attempt: {login_data.username}")
    
    try:
        from database import SessionLocal
        db = SessionLocal()
        
        # Find user
        user = db.query(User).filter(User.username == login_data.username).first()
        if not user:
            db.close()
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        # Verify password
        if not verify_password(login_data.password, user.password_hash):
            db.close()
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        # Create token
        access_token = create_access_token(data={"sub": user.username, "user_id": user.id})
        
        result = {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.fullname,
                "created_at": user.created_at.isoformat()
            }
        }
        
        db.close()
        print(f" Login successful for: {login_data.username}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f" Login error: {str(e)}")
        return {"error": f"Login failed: {str(e)}"}

# 3. FORGOT PASSWORD API
@app.post("/forgot-password")
def forgot_password(forgot_data: ForgotPassword, db: Session = Depends(get_db)):
    print(f" Password reset request for: {forgot_data.email}")
    
    # Check if user exists
    user = db.query(User).filter(User.email == forgot_data.email).first()
    if not user:
        # Don't reveal if email exists or not for security
        return {"message": "If email exists, reset link has been sent"}
    
    # Generate reset token
    reset_token = generate_reset_token()
    expires_at = datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
    
    # Save reset token
    reset_record = PasswordReset(
        email=forgot_data.email,
        reset_token=reset_token,
        expires_at=expires_at
    )
    
    db.add(reset_record)
    db.commit()
    
    print(f" Reset token generated for: {forgot_data.email}")
    print(f" Reset Token: {reset_token}")  # In real app, send via email
    
    return {
        "message": "If email exists, reset link has been sent",
        "reset_token": reset_token  # Only for testing - remove in production
    }

# RESET PASSWORD API (Bonus)
@app.post("/reset-password")
def reset_password(reset_data: ResetPassword, db: Session = Depends(get_db)):
    print(f" Password reset with token: {reset_data.token[:10]}...")
    
    # Find valid reset token
    reset_record = db.query(PasswordReset).filter(
        PasswordReset.reset_token == reset_data.token,
        PasswordReset.is_used == False,
        PasswordReset.expires_at > datetime.utcnow()
    ).first()
    
    if not reset_record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Find user
    user = db.query(User).filter(User.email == reset_record.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update password
    user.password_hash = hash_password(reset_data.new_password)
    reset_record.is_used = True
    
    db.commit()
    
    print(f" Password reset successful for: {reset_record.email}")
    return {"message": "Password reset successful"}

@app.get("/")
def read_root():
    return {"message": "User Authentication API is running!"}

# ================================
# BINANCE API ENDPOINTS
# ================================

@app.get("/binance/account")
def get_binance_account():
    """Get Binance account information and balances"""
    try:
        account_data = binance_service.get_formatted_balances()
        return {
            "success": True,
            "data": account_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/binance/balance")
def get_binance_balance():
    """Get Binance account balances only"""
    try:
        account_data = binance_service.get_formatted_balances()
        return {
            "success": True,
            "balances": account_data["balances"],
            "total_assets": len(account_data["balances"])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/binance/balance/{asset}")
def get_specific_balance(asset: str):
    """Get balance for a specific asset"""
    try:
        account_data = binance_service.get_formatted_balances()
        
        # Find specific asset
        for balance in account_data["balances"]:
            if balance["asset"].upper() == asset.upper():
                return {
                    "success": True,
                    "asset": balance["asset"],
                    "balance": balance
                }
        
        return {
            "success": False,
            "message": f"Asset {asset.upper()} not found or has zero balance"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/binance/console")
def show_balance_in_console():
    """Show balance in server console and return summary"""
    try:
        print("\n" + "="*60)
        print("🚀 BINANCE PORTFOLIO SUMMARY")
        print("="*60)
        
        account_data = binance_service.get_formatted_balances()
        
        return {
            "success": True,
            "message": "Balance displayed in console",
            "total_usd_value": account_data["total_usd_value"],
            "total_assets": len(account_data["balances"]),
            "console_output": "Check server console for detailed balance information"
        }
    except Exception as e:
        print(f"❌ Error fetching balance: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print(" Starting User Auth API on http://localhost:8002")
    uvicorn.run(app, host="127.0.0.1", port=8002)
