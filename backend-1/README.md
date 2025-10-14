# 🚀 User Authentication API

Simple and secure FastAPI authentication system with PostgreSQL database.

## 📋 Features

- **User Registration** - Create new user accounts
- **User Login** - JWT token-based authentication  
- **Password Security** - SHA256 hashing
- **Database** - PostgreSQL with SQLAlchemy ORM
- **API Documentation** - Auto-generated Swagger UI

## 🛠️ Technology Stack

- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Authentication:** JWT tokens
- **Password Hashing:** SHA256
- **Validation:** Pydantic

## 📁 Project Structure

```
backend-1/
├── main.py           # Main FastAPI application (120 lines)
├── database.py       # Database configuration
├── models.py         # SQLAlchemy models (User table)
├── schemas.py        # Pydantic schemas (validation)
├── requirements.txt  # Python dependencies
├── run-server.bat    # Windows batch file to start server
└── README.md         # This documentation
```

## 🔧 Installation & Setup

### Prerequisites
- Python 3.8+
- PostgreSQL database
- Git (optional)

### Method 1: Using Batch File (Recommended)
```bash
# Navigate to backend-1 folder
cd backend-1

# Run the batch file (auto-installs dependencies)
run-server.bat
```

### Method 2: Manual Setup
```bash
# 1. Create virtual environment
python -m venv venv

# 2. Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start server
python main.py
```

### Method 3: Direct Python
```bash
# Install dependencies globally (not recommended)
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic PyJWT python-multipart email-validator

# Run server
python main.py
```

## 🗄️ Database Configuration

Update database credentials in `database.py`:
```python
DATABASE_URL = "postgresql://username:password@localhost:5432/database_name"
```

Default configuration:
- **Host:** localhost:5432
- **Username:** postgres  
- **Password:** admin
- **Database:** Users_login

## 🚀 API Endpoints

### Base URL: `http://localhost:8002`

### 1. Health Check
```
GET /
Response: {"message": "User Authentication API is running!"}
```

### 2. User Registration
```
POST /register
Content-Type: application/json

Request Body:
{
  "username": "testuser",
  "email": "test@example.com",
  "full_name": "Test User", 
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "full_name": "Test User"
  }
}
```

### 3. User Login
```
POST /login
Content-Type: application/json

Request Body:
{
  "username": "testuser",
  "password": "password123"
}

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "testuser", 
    "email": "test@example.com",
    "full_name": "Test User",
    "created_at": "2024-01-01T12:00:00"
  }
}
```

## 📖 API Documentation

Interactive API documentation available at:
- **Swagger UI:** http://localhost:8002/docs
- **ReDoc:** http://localhost:8002/redoc

## 🔒 Security Features

### ✅ Implemented
- **Password Hashing** - SHA256 encryption
- **JWT Tokens** - 30-minute expiration
- **Input Validation** - Username (3+ chars), Email format, Password (6+ chars)
- **SQL Injection Protection** - SQLAlchemy ORM
- **CORS Support** - Cross-origin requests
- **Unique Constraints** - Username and email uniqueness

### ⚠️ Production Recommendations
- Use **bcrypt** instead of SHA256 for passwords
- Implement **rate limiting** for brute force protection
- Add **email verification** system
- Use **environment variables** for secrets
- Enable **HTTPS only** in production
- Add **logging** for security events

## 🧪 Testing

### Using cURL
```bash
# Registration
curl -X POST "http://localhost:8002/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","full_name":"Test User","password":"password123"}'

# Login  
curl -X POST "http://localhost:8002/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Using Python requests
```python
import requests

# Registration
response = requests.post("http://localhost:8002/register", json={
    "username": "testuser",
    "email": "test@example.com", 
    "full_name": "Test User",
    "password": "password123"
})

# Login
response = requests.post("http://localhost:8002/login", json={
    "username": "testuser",
    "password": "password123"
})
```

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Error**
```
Solution: Check PostgreSQL is running and credentials are correct
```

**2. Module Not Found Error**
```
Solution: Run pip install -r requirements.txt
```

**3. Port Already in Use**
```
Solution: Change port in main.py or kill existing process
```

**4. Table Does Not Exist**
```
Solution: Restart server - tables auto-create on startup
```

## 📊 Code Statistics

- **Total Lines:** ~120 (reduced from 240)
- **Essential Code Only:** Removed 50% unused code
- **Files:** 5 core files
- **Dependencies:** 8 packages
- **Security Level:** 7/10 (good for development)

## 🔄 Development Workflow

1. **Make changes** to code
2. **Restart server** (Ctrl+C then run-server.bat)
3. **Test APIs** using /docs interface
4. **Check terminal** for debug messages
5. **Verify database** changes

## 📝 License

This project is for educational purposes. Use at your own risk in production.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly  
5. Submit pull request

---

**🎯 Quick Start:** Just run `run-server.bat` and visit `http://localhost:8002/docs` to test the APIs!
