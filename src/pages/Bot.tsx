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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Bot</h2>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Configure trading parameters. Derived symbols update automatically.</p>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Selected Coin */}
          <div>
            <label className="block text-theme-sm text-gray-700 dark:text-gray-200 mb-1">Selected Coin</label>
            <div className="flex items-center gap-2">
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value as Coin)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
              >
                {(["XRP", "BTC", "ETH", "SOL", "DOGE"] as Coin[]).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setSelectedCoin((c) => c === "XRP" ? "BTC" : c === "BTC" ? "ETH" : c === "ETH" ? "SOL" : c === "SOL" ? "DOGE" : "XRP")}
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                aria-label="Cycle through coins"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H8" />
                </svg>
              </button>
            </div>
          </div>

          {/* Percentage (Slider + Value Box) */}
          <div className="flex flex-col gap-2">
            <label className="block text-theme-sm text-gray-700 dark:text-gray-200 mb-2">Percentage Allocation</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPercentage((s) => to2(Math.max(0, s - 1)))}
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                aria-label="Decrease percentage allocation"
              >
                −
              </button>
              {/* Visual slider track */}
              <div className="relative flex-1">
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800" />
                <div
                  className="absolute top-0 left-0 h-2 rounded-full bg-brand-500"
                  style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
                />
                {/* Transparent native range input for accessibility */}
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                  aria-label="Percentage Allocation"
                />
              </div>
              {/* Value box */}
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={percentage}
                onChange={handleNumberInput(setPercentage, 0, 100)}
                className="w-20 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-2 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Stop Loss */}
          <div>
            <label className="block text-theme-sm text-gray-700 dark:text-gray-200 mb-1">Stop Loss (%)</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStopLoss((s) => to2(Math.max(0, s - 0.1)))}
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                aria-label="Decrease stop loss"
              >
                −
              </button>
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={stopLoss}
                  onChange={handleNumberInput(setStopLoss, 0)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent pr-12 pl-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. 1.50"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">%</span>
              </div>
              <button
                type="button"
                onClick={() => setStopLoss((s) => to2(Math.max(0, s + 0.1)))}
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                aria-label="Increase stop loss"
              >
                +
              </button>
            </div>
          </div>

          {/* Take Profit */}
          <div>
            <label className="block text-theme-sm text-gray-700 dark:text-gray-200 mb-1">Take Profit (%)</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTakeProfit((s) => to2(Math.max(0, s - 0.1)))}
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                aria-label="Decrease take profit"
              >
                −
              </button>
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={takeProfit}
                  onChange={handleNumberInput(setTakeProfit, 0)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent pr-12 pl-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. 1.50"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">%</span>
              </div>
              <button
                type="button"
                onClick={() => setTakeProfit((s) => to2(Math.max(0, s + 0.1)))}
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                aria-label="Increase take profit"
              >
                +
              </button>
            </div>
            <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">Non‑negative. Two decimals supported.</p>
          </div>

          {/* Profit Factor */}
          <div>
            <label className="block text-theme-sm text-gray-700 dark:text-gray-200 mb-1">Profit Factor</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setProfitFactor((s) => to2(Math.max(0, s - 0.1)))}
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                aria-label="Decrease profit factor"
              >
                −
              </button>
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={profitFactor}
                  onChange={handleNumberInput(setProfitFactor, 0)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent pr-10 pl-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. 1.00"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">×</span>
              </div>
              <button
                type="button"
                onClick={() => setProfitFactor((s) => to2(Math.max(0, s + 0.1)))}
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                aria-label="Increase profit factor"
              >
                +
              </button>
            </div>
            <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">Non‑negative. Two decimals supported.</p>
          </div>
        </div>
      </div>

      {/* Derived values */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:p-6">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Derived Symbols</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-theme-xs text-gray-500 dark:text-gray-400 mb-1">coinm_symbol</div>
            <div className="text-gray-900 dark:text-white font-mono text-sm break-all">{coinmSymbol}</div>
          </div>
          <div>
            <div className="text-theme-xs text-gray-500 dark:text-gray-400 mb-1">spot_symbol</div>
            <div className="text-gray-900 dark:text-white font-mono text-sm break-all">{spotSymbol}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
