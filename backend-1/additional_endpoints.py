# Add these endpoints to your main.py file

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from client_models import Client, BotConfig
from database import get_db

# Client Schemas (add to schemas.py)
from pydantic import BaseModel

class ClientCreate(BaseModel):
    full_name: str
    api_key: str
    api_token: str

class ClientResponse(BaseModel):
    id: int
    full_name: str
    api_key: str
    api_token: str
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True

class BotConfigCreate(BaseModel):
    selected_coin: str
    percentage: float
    stop_loss: float
    take_profit: float
    profit_factor: float

class BotConfigResponse(BaseModel):
    id: int
    selected_coin: str
    percentage: float
    stop_loss: float
    take_profit: float
    profit_factor: float
    is_active: bool
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True

# CLIENT ENDPOINTS
@app.get("/clients", response_model=List[ClientResponse])
def get_clients(db: Session = Depends(get_db)):
    """Get all clients for the authenticated user"""
    clients = db.query(Client).all()
    return clients

@app.post("/clients", response_model=ClientResponse)
def create_client(client_data: ClientCreate, db: Session = Depends(get_db)):
    """Create a new client"""
    new_client = Client(
        full_name=client_data.full_name,
        api_key=client_data.api_key,
        api_token=client_data.api_token,
        user_id=1  # In real app, get from JWT token
    )
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    return new_client

@app.put("/clients/{client_id}", response_model=ClientResponse)
def update_client(client_id: int, client_data: ClientCreate, db: Session = Depends(get_db)):
    """Update a client"""
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    client.full_name = client_data.full_name
    client.api_key = client_data.api_key
    client.api_token = client_data.api_token
    db.commit()
    db.refresh(client)
    return client

@app.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    """Delete a client"""
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    db.delete(client)
    db.commit()
    return {"success": True, "id": client_id}

# BOT CONFIG ENDPOINTS
@app.get("/bot/configs", response_model=List[BotConfigResponse])
def get_bot_configs(db: Session = Depends(get_db)):
    """Get all bot configurations"""
    configs = db.query(BotConfig).all()
    return configs

@app.get("/bot/active", response_model=BotConfigResponse)
def get_active_bot_config(db: Session = Depends(get_db)):
    """Get active bot configuration"""
    config = db.query(BotConfig).filter(BotConfig.is_active == True).first()
    if not config:
        raise HTTPException(status_code=404, detail="No active bot configuration")
    return config

@app.post("/bot/configs", response_model=BotConfigResponse)
def create_bot_config(config_data: BotConfigCreate, db: Session = Depends(get_db)):
    """Create a new bot configuration"""
    new_config = BotConfig(
        selected_coin=config_data.selected_coin,
        percentage=config_data.percentage,
        stop_loss=config_data.stop_loss,
        take_profit=config_data.take_profit,
        profit_factor=config_data.profit_factor,
        user_id=1  # In real app, get from JWT token
    )
    db.add(new_config)
    db.commit()
    db.refresh(new_config)
    return new_config

@app.post("/bot/configs/{config_id}/toggle")
def toggle_bot(config_id: int, db: Session = Depends(get_db)):
    """Start/Stop bot configuration"""
    # Deactivate all configs
    db.query(BotConfig).update({BotConfig.is_active: False})
    
    # Activate the selected config
    config = db.query(BotConfig).filter(BotConfig.id == config_id).first()
    if not config:
        raise HTTPException(status_code=404, detail="Bot configuration not found")
    
    config.is_active = True
    db.commit()
    
    return {"success": True, "isActive": True}
