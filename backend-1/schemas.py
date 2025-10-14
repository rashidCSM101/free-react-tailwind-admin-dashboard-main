from pydantic import BaseModel
from datetime import datetime

class UserRegister(BaseModel):
    username: str
    email: str
    full_name: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class ForgotPassword(BaseModel):
    email: str

class ResetPassword(BaseModel):
    token: str
    new_password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    fullname: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
