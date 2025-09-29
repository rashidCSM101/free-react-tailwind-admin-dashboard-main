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
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Configure trading parameters. Derived symbols update automatically.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Selected Coin */}
          <div>
            <label className="block text-theme-sm text-gray-700 dark:text-gray-200 mb-1">Selected Coin</label>
            <select
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value as Coin)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {(["XRP", "BTC", "ETH", "SOL", "DOGE"] as Coin[]).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Percentage */}
          <div>
            <label className="block text-theme-sm text-gray-700 dark:text-gray-200 mb-1">Percentage</label>
            <input
              type="number"
              step="1"
              min={0}
              max={100}
              value={percentage}
              onChange={handleNumberInput(setPercentage, 0, 100)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="0 - 100"
            />
          </div>

          {/* Stop Loss */}
          <div>
            <label className="block text-theme-sm text-gray-700 dark:text-gray-200 mb-1">Stop Loss (%)</label>
            <input
              type="number"
              step="0.01"
              min={0}
              value={stopLoss}
              onChange={handleNumberInput(setStopLoss, 0)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. 1.50"
            />
          </div>

          {/* Take Profit */}
          <div>
            <label className="block text-theme-sm text-gray-700 dark:text-gray-200 mb-1">Take Profit (%)</label>
            <input
              type="number"
              step="0.01"
              min={0}
              value={takeProfit}
              onChange={handleNumberInput(setTakeProfit, 0)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. 1.50"
            />
          </div>

          {/* Profit Factor */}
          <div>
            <label className="block text-theme-sm text-gray-700 dark:text-gray-200 mb-1">Profit Factor</label>
            <input
              type="number"
              step="0.01"
              min={0}
              value={profitFactor}
              onChange={handleNumberInput(setProfitFactor, 0)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. 1.00"
            />
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
