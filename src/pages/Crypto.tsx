import { useState, useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import PageMeta from '../components/common/PageMeta';

interface Balance {
  asset: string;
  free: number;
  locked: number;
  total: number;
  usd_price: number;
  usd_value: number;
}

interface BinanceData {
  account_type: string;
  can_trade: boolean;
  can_withdraw: boolean;
  can_deposit: boolean;
  balances: Balance[];
  total_usd_value: number;
}

export default function Crypto() {
  const [balanceData, setBalanceData] = useState<BinanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAppSelector((state) => state.auth);

  const fetchBalance = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8002/binance/account', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setBalanceData(result.data);
        } else {
          setError('Failed to fetch balance data');
        }
      } else {
        setError('API request failed');
      }
    } catch (err) {
      setError('Network error or server not running');
      console.error('Binance API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [token]);

  return (
    <>
      <PageMeta
        title="Crypto Portfolio | TailAdmin"
        description="View your Binance cryptocurrency portfolio and balances"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Crypto Portfolio
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor your Binance account balances and portfolio performance
            </p>
          </div>
          
          <button
            onClick={fetchBalance}
            disabled={loading}
            className="px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
              <span className="ml-4 text-gray-600 dark:text-gray-400">Loading portfolio data...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <div>
                <h3 className="text-red-800 dark:text-red-200 font-medium">Connection Error</h3>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Data */}
        {balanceData && !loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Portfolio Overview */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Portfolio Overview
                </h2>
                
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Value</p>
                    <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">
                      ${balanceData.total_usd_value.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Assets</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {balanceData.balances.length}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Account</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {balanceData.account_type}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Trading</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        balanceData.can_trade 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      }`}>
                        {balanceData.can_trade ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Withdraw</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        balanceData.can_withdraw 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      }`}>
                        {balanceData.can_withdraw ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Deposit</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        balanceData.can_deposit 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      }`}>
                        {balanceData.can_deposit ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Asset Balances */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Asset Balances
                </h2>
                
                {balanceData.balances.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Asset</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Balance</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Price</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {balanceData.balances.map((balance, index) => (
                          <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                                    {balance.asset.slice(0, 2)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">{balance.asset}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Free: {balance.free.toFixed(8)}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {balance.total.toFixed(8)}
                              </p>
                              {balance.locked > 0 && (
                                <p className="text-xs text-orange-600 dark:text-orange-400">
                                  Locked: {balance.locked.toFixed(8)}
                                </p>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <p className="font-medium text-gray-900 dark:text-white">
                                ${balance.usd_price.toFixed(4)}
                              </p>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <p className="font-medium text-gray-900 dark:text-white">
                                ${balance.usd_value.toFixed(2)}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <p>No balances found</p>
                    <p className="text-sm">Your portfolio appears to be empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
