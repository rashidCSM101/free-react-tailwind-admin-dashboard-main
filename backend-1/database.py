# Import SQLAlchemy components
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database configuration - AWS RDS
# You need to get the RDS endpoint from AWS Console
DATABASE_URL = "postgresql://postgres:reactapp@userslogin.cdwgy2og0j09.eu-north-1.rds.amazonaws.com:5432/postgres"
# Format: postgresql://username:password@host:port/database_name
# postgres = username
# reactapp = password  
# userslogin.cdwgy2og0j09.eu-north-1.rds.amazonaws.com = AWS RDS host
# 5432 = PostgreSQL default port
# postgres = database name

# Create database engine
engine = create_engine(DATABASE_URL)

# Create sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for declarative class definitions
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
