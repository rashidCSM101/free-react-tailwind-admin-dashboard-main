import os
from dotenv import load_dotenv
import requests
import hmac
import hashlib
import time
from fastapi import HTTPException

# Load environment variables
load_dotenv()

class BinanceService:
    def __init__(self):
        self.api_key = os.getenv('BINANCE_API_KEY')
        self.api_secret = os.getenv('BINANCE_API_SECRET')
        self.base_url = 'https://api.binance.com'
        
        if not self.api_key or not self.api_secret:
            raise ValueError("Binance API keys not found in .env file!")
    
    def _generate_signature(self, query_string):
        """Generate HMAC SHA256 signature"""
        return hmac.new(
            self.api_secret.encode('utf-8'),
            query_string.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
    
    def get_account_info(self):
        """Get account information and balances"""
        try:
            # Endpoint
            endpoint = '/api/v3/account'
            
            # Parameters
            timestamp = int(time.time() * 1000)
            query_string = f'timestamp={timestamp}'
            
            # Generate signature
            signature = self._generate_signature(query_string)
            query_string += f'&signature={signature}'
            
            # Headers
            headers = {
                'X-MBX-APIKEY': self.api_key
            }
            
            # Make request
            url = f"{self.base_url}{endpoint}?{query_string}"
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Binance API Error: {response.text}"
                )
                
        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    
    def get_price(self, symbol):
        """Get current price for a symbol"""
        try:
            url = f"{self.base_url}/api/v3/ticker/price"
            params = {'symbol': symbol}
            response = requests.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                return float(data['price'])
            return 0.0
        except:
            return 0.0
    
    def get_formatted_balances(self):
        """Get formatted account balances with USD values"""
        account_info = self.get_account_info()
        
        # Extract account details
        account_data = {
            "account_type": account_info.get('accountType', 'N/A'),
            "can_trade": account_info.get('canTrade', False),
            "can_withdraw": account_info.get('canWithdraw', False),
            "can_deposit": account_info.get('canDeposit', False),
            "balances": [],
            "total_usd_value": 0.0
        }
        
        # Process balances
        balances = account_info.get('balances', [])
        total_usd = 0.0
        
        for balance in balances:
            free = float(balance['free'])
            locked = float(balance['locked'])
            total = free + locked
            
            # Only include non-zero balances
            if total > 0:
                asset = balance['asset']
                usd_price = 0.0
                usd_value = 0.0
                
                # Get USD price
                if asset == 'USDT' or asset == 'USDC' or asset == 'BUSD':
                    usd_price = 1.0
                    usd_value = total
                else:
                    # Try to get price in USDT
                    symbol = f"{asset}USDT"
                    usd_price = self.get_price(symbol)
                    usd_value = total * usd_price
                
                total_usd += usd_value
                
                balance_data = {
                    'asset': asset,
                    'free': free,
                    'locked': locked,
                    'total': total,
                    'usd_price': usd_price,
                    'usd_value': usd_value
                }
                
                account_data["balances"].append(balance_data)
                
                # Console output
                print(f"💰 {asset:<8} | Total: {total:<15.8f} | Price: ${usd_price:<10.4f} | Value: ${usd_value:<10.2f}")
        
        account_data["total_usd_value"] = total_usd
        
        # Console summary
        print(f"\n💵 Total Portfolio Value: ${total_usd:.2f}")
        print("=" * 60)
        
        return account_data

# Create global instance
binance_service = BinanceService()
