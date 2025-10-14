import os
from dotenv import load_dotenv
import requests
import hmac
import hashlib
import time

# Load environment variables
load_dotenv()

class BinanceAPI:
    def __init__(self):
        self.api_key = os.getenv('BINANCE_API_KEY')
        self.api_secret = os.getenv('BINANCE_API_SECRET')
        self.base_url = 'https://api.binance.com'
        
        if not self.api_key or not self.api_secret:
            raise ValueError("❌ Binance API keys not found in .env file!")
        
        print(f"✅ API Key loaded: {self.api_key[:10]}...")
        print(f"✅ API Secret loaded: {self.api_secret[:10]}...")
    
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
                print(f"❌ API Error: {response.status_code}")
                print(f"❌ Response: {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Exception: {str(e)}")
            return None
    
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

    def display_balances(self):
        """Display account balances with USD values"""
        print("\n🔍 Fetching Binance Account Information...")
        print("=" * 70)
        
        account_info = self.get_account_info()
        
        if not account_info:
            print("❌ Failed to fetch account information")
            return
        
        print(f"✅ Account Type: {account_info.get('accountType', 'N/A')}")
        print(f"✅ Can Trade: {account_info.get('canTrade', False)}")
        print(f"✅ Can Withdraw: {account_info.get('canWithdraw', False)}")
        print(f"✅ Can Deposit: {account_info.get('canDeposit', False)}")
        
        print("\n💰 Account Balances with USD Values:")
        print("-" * 70)
        
        balances = account_info.get('balances', [])
        non_zero_balances = []
        total_usd = 0.0
        
        for balance in balances:
            free = float(balance['free'])
            locked = float(balance['locked'])
            total = free + locked
            
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
                
                non_zero_balances.append({
                    'asset': asset,
                    'free': free,
                    'locked': locked,
                    'total': total,
                    'usd_price': usd_price,
                    'usd_value': usd_value
                })
        
        if non_zero_balances:
            print(f"{'Asset':<8} {'Total':<15} {'USD Price':<12} {'USD Value':<12}")
            print("-" * 70)
            
            for balance in non_zero_balances:
                print(f"{balance['asset']:<8} {balance['total']:<15.8f} ${balance['usd_price']:<11.4f} ${balance['usd_value']:<11.2f}")
            
            print("-" * 70)
            print(f"💵 Total Portfolio Value: ${total_usd:.2f}")
        else:
            print("❌ No balances found or all balances are zero")
        
        print("\n" + "=" * 70)

def main():
    """Main function to test Binance API"""
    print("🚀 Binance API Balance Checker")
    print("=" * 50)
    
    try:
        # Initialize Binance API
        binance = BinanceAPI()
        
        # Display balances
        binance.display_balances()
        
    except ValueError as e:
        print(str(e))
        print("\n💡 Make sure your .env file contains:")
        print("BINANCE_API_KEY=your_api_key_here")
        print("BINANCE_API_SECRET=your_api_secret_here")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

if __name__ == "__main__":
    main()
