import { useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

type Coin = "XRP" | "BTC" | "ETH" | "SOL" | "DOGE";

interface BotFormValues {
  selectedCoin: Coin;
  percentage: number;
  stopLoss: number;
  takeProfit: number;
  profitFactor: number;
}

const validationSchema = Yup.object({
  selectedCoin: Yup.string().required("Coin selection is required"),
  percentage: Yup.number()
    .min(0.2, "Percentage must be at least 0.2")
    .max(100, "Percentage cannot exceed 100")
    .required("Percentage is required"),
  stopLoss: Yup.number()
    .min(0.2, "Stop Loss must be at least 0.2")
    .required("Stop Loss is required"),
  takeProfit: Yup.number()
    .min(0.2, "Take Profit must be at least 0.2")
    .required("Take Profit is required"),
  profitFactor: Yup.number()
    .min(0.2, "Profit Factor must be at least 0.2")
    .required("Profit Factor is required"),
});

const initialValues: BotFormValues = {
  selectedCoin: "XRP",
  percentage: 10,
  stopLoss: 0.2,
  takeProfit: 0.2,
  profitFactor: 0.2,
};

export default function Bot() {
  const [isLocked, setIsLocked] = useState(false);

  const to2 = (v: number) => Number.isFinite(v) ? Number(v.toFixed(2)) : 0;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Form submitted:", values);
      }}
    >
      {({ values, errors, touched, setFieldValue }) => {
        const coinmSymbol = useMemo(
          () => `${values.selectedCoin.toUpperCase()}USD_PERP`,
          [values.selectedCoin],
        );
        const spotSymbol = useMemo(
          () => `${values.selectedCoin.toUpperCase()}USDT`,
          [values.selectedCoin],
        );

        const handleIncrement = (field: keyof BotFormValues, step: number, max?: number) => {
          const currentValue = values[field] as number;
          const newValue = to2(currentValue + step);
          const finalValue = max ? Math.min(newValue, max) : newValue;
          setFieldValue(field, finalValue);
        };

        const handleDecrement = (field: keyof BotFormValues, step: number, min: number = 0.2) => {
          const currentValue = values[field] as number;
          const newValue = to2(Math.max(min, currentValue - step));
          setFieldValue(field, newValue);
        };

        return (
          <Form>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trading Strategy: {values.selectedCoin}</h2>
                  <div className="flex items-center gap-1 text-brand-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLocked(!isLocked)}
                    className={`ml-auto p-2 rounded-lg ${isLocked ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                  >
                    {isLocked ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2V7a5 5 0 00-5-5zm0 9a2 2 0 100-4 2 2 0 000 4z" /></svg>
                    )}
                  </button>
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
              <Field
                as="select"
                name="selectedCoin"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white text-gray-900 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white disabled:opacity-50"
                disabled={isLocked}
              >
                {(["XRP", "BTC", "ETH", "SOL", "DOGE"] as Coin[]).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Field>
              {errors.selectedCoin && touched.selectedCoin && (
                <div className="text-red-500 text-sm mt-1">{errors.selectedCoin}</div>
              )}
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
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{values.stopLoss}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDecrement('stopLoss', 0.1)}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50"
                  disabled={isLocked}
                >
                  −
                </button>
                <div className="flex-1">
                  <Field
                    type="number"
                    name="stopLoss"
                    step="0.01"
                    min={0.2}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
                    disabled={isLocked}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleIncrement('stopLoss', 0.1)}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50"
                  disabled={isLocked}
                >
                  +
                </button>
              </div>
              {errors.stopLoss && touched.stopLoss && (
                <div className="text-red-500 text-sm mt-1">{errors.stopLoss}</div>
              )}
            </div>

            {/* Take Profit */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Take Profit (%)</label>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{values.takeProfit}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDecrement('takeProfit', 0.1)}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50"
                  disabled={isLocked}
                >
                  −
                </button>
                <div className="flex-1">
                  <Field
                    type="number"
                    name="takeProfit"
                    step="0.01"
                    min={0.2}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
                    disabled={isLocked}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleIncrement('takeProfit', 0.1)}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50"
                >
                  +
                </button>
              </div>
              {errors.takeProfit && touched.takeProfit && (
                <div className="text-red-500 text-sm mt-1">{errors.takeProfit}</div>
              )}
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
                      strokeDasharray={`${values.percentage}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{values.percentage}%</span>
                  </div>
                </div>
                <div className="flex-1 ml-4">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => handleDecrement('percentage', 5, 0.2)}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50"
                      disabled={isLocked}
                    >
                      −
                    </button>
                    <div className="flex-1 relative">
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-brand-500 transition-all duration-300"
                          style={{ width: `${Math.min(Math.max(values.percentage, 0), 100)}%` }}
                        />
                      </div>
                      <Field
                        type="range"
                        name="percentage"
                        min={0.2}
                        max={100}
                        step={1}
                        className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer disabled:opacity-50"
                        disabled={isLocked}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleIncrement('percentage', 5, 100)}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50"
                      disabled={isLocked}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              {errors.percentage && touched.percentage && (
                <div className="text-red-500 text-sm mt-1">{errors.percentage}</div>
              )}
            </div>

            {/* Profit Factor */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Profit Factor</label>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{values.profitFactor}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDecrement('profitFactor', 0.1)}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50"
                  disabled={isLocked}
                >
                  −
                </button>
                <div className="flex-1">
                  <Field
                    type="number"
                    name="profitFactor"
                    step="0.01"
                    min={0.2}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
                    disabled={isLocked}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleIncrement('profitFactor', 0.1)}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50"
                  disabled={isLocked}
                >
                  +
                </button>
              </div>
              {errors.profitFactor && touched.profitFactor && (
                <div className="text-red-500 text-sm mt-1">{errors.profitFactor}</div>
              )}
            </div>
          </div>
        </div>
      </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
