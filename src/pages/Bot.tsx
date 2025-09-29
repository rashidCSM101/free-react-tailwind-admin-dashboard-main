import { useMemo, useState } from "react";

type Coin = "XRP" | "BTC" | "ETH" | "SOL" | "DOGE";

export default function Bot() {
  const [selectedCoin, setSelectedCoin] = useState<Coin>("XRP");
  const [percentage, setPercentage] = useState<number>(80);
  const [stopLoss, setStopLoss] = useState<number>(1.5);
  const [takeProfit, setTakeProfit] = useState<number>(1.5);
  const [profitFactor, setProfitFactor] = useState<number>(1.0);

  const coinmSymbol = useMemo(
    () => `${selectedCoin.toUpperCase()}USD_PERP`,
    [selectedCoin],
  );
  const spotSymbol = useMemo(
    () => `${selectedCoin.toUpperCase()}USDT`,
    [selectedCoin],
  );

  const to2 = (v: number) => Number.isFinite(v) ? Number(v.toFixed(2)) : 0;

  const handleNumberInput = (
    setter: (n: number) => void,
    min: number = 0,
    max?: number,
  ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const num = Number(raw);
      if (Number.isNaN(num)) {
        setter(min);
        return;
      }
      let v = Math.max(min, num);
      if (typeof max === "number") v = Math.min(max, v);
      setter(to2(v));
    };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trading Strategy: {selectedCoin}</h2>
          <div className="flex items-center gap-1 text-brand-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Asset Selection Card */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Asset Selection</h3>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cryptocurrency</label>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value as Coin)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white text-gray-900 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
              >
                {(["XRP", "BTC", "ETH", "SOL", "DOGE"] as Coin[]).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="pt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Spot Symbol:</span>
                <span className="font-mono text-gray-900 dark:text-white">{spotSymbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Futures Symbol:</span>
                <span className="font-mono text-gray-900 dark:text-white">{coinmSymbol}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Management Card */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Risk Management</h3>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="space-y-6">
            {/* Stop Loss */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stop Loss (%)</label>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{stopLoss}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStopLoss((s) => to2(Math.max(0, s - 0.1)))}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  −
                </button>
                <div className="flex-1">
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={stopLoss}
                    onChange={handleNumberInput(setStopLoss, 0)}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setStopLoss((s) => to2(Math.max(0, s + 0.1)))}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  +
                </button>
              </div>
            </div>

            {/* Take Profit */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Take Profit (%)</label>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{takeProfit}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTakeProfit((s) => to2(Math.max(0, s - 0.1)))}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  −
                </button>
                <div className="flex-1">
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={takeProfit}
                    onChange={handleNumberInput(setTakeProfit, 0)}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setTakeProfit((s) => to2(Math.max(0, s + 0.1)))}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Capital & Allocation Card */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Capital & Allocation</h3>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="space-y-6">
            {/* Percentage Allocation with circular progress */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200 dark:text-gray-700"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-brand-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={`${percentage}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{percentage}%</span>
                  </div>
                </div>
                <div className="flex-1 ml-4">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setPercentage((s) => to2(Math.max(0, s - 5)))}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      −
                    </button>
                    <div className="flex-1 relative">
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-brand-500 transition-all duration-300"
                          style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
                        />
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={percentage}
                        onChange={(e) => setPercentage(Number(e.target.value))}
                        className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setPercentage((s) => to2(Math.min(100, s + 5)))}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profit Factor */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Profit Factor</label>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{profitFactor}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setProfitFactor((s) => to2(Math.max(0, s - 0.1)))}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  −
                </button>
                <div className="flex-1">
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={profitFactor}
                    onChange={handleNumberInput(setProfitFactor, 0)}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setProfitFactor((s) => to2(Math.max(0, s + 0.1)))}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
