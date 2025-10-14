# Additional models for your backend
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    api_key = Column(String(255), nullable=False)
    api_token = Column(String(255), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationship
    user = relationship("User", back_populates="clients")

class BotConfig(Base):
    __tablename__ = "bot_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    selected_coin = Column(String(10), nullable=False)
    percentage = Column(Float, nullable=False)
    stop_loss = Column(Float, nullable=False)
    take_profit = Column(Float, nullable=False)
    profit_factor = Column(Float, nullable=False)
    is_active = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationship
    user = relationship("User", back_populates="bot_configs")

# Update User model to include relationships
# Add this to your existing models.py:
# user = relationship("Client", back_populates="user")
# bot_configs = relationship("BotConfig", back_populates="user")
