import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { takeAction } from "../api/sessionApi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function TradePage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [actionMessage, setActionMessage] = useState(null);
  const [actionMessageType, setActionMessageType] = useState("info");

  // ---- Send Trade Action ----
  const sendAction = async (action, qty = 0) => {
    try {
      const data = await takeAction(sessionId, action, qty);
      setState(data);

      // Track price history - ensure we always add the point
      const newPoint = {
        step: data.step,
        price: data.price,
        cash: data.portfolio.cash,
        shares: data.portfolio.shares,
      };

      setPriceHistory((prev) => {
        // Check if this step already exists
        const exists = prev.some((p) => p.step === newPoint.step);
        if (!exists) {
          return [...prev, newPoint];
        }
        return prev;
      });

      // Show action result message if available
      if (data.actionResult) {
        if (!data.actionResult.success) {
          setActionMessage(data.actionResult.reason || "Action failed");
          setActionMessageType("error");
          // clear after 3s
          setTimeout(() => setActionMessage(null), 3000);
        } else {
          setActionMessage("Action processed");
          setActionMessageType("success");
          setTimeout(() => setActionMessage(null), 1800);
        }
      }

      if (data.finished) {
        navigate(`/result/${sessionId}`, { state: data });
      }
    } catch (error) {
      console.error("Error taking action:", error);
      setActionMessage("Network error while processing action");
      setActionMessageType("error");
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  // ---- Run initial HOLD once ----
  useEffect(() => {
    if (sessionId) {
      sendAction("HOLD");
    }
  }, [sessionId]);

  // ---- Loading UI ----
  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl backdrop-blur-sm border border-emerald-500/30">
            <svg
              className="w-10 h-10 text-emerald-500 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-white text-xl font-semibold mb-2">
            Initializing Market
          </p>
          <p className="text-gray-400 text-sm">
            Loading trading environment...
          </p>
        </div>
      </div>
    );
  }

  const isProfitable = (state?.portfolio.unrealizedPnl || 0) >= 0;
  const chartColor = isProfitable ? "#10b981" : "#ef4444";
  const priceChange =
    priceHistory.length > 1
      ? priceHistory[priceHistory.length - 1].price - priceHistory[0].price
      : 0;
  const priceChangePercent =
    priceHistory.length > 1
      ? ((priceChange / priceHistory[0].price) * 100).toFixed(2)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header Bar */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-xl font-bold text-white mb-0.5">STOCK</h1>
                <p className="text-xs text-gray-500">Step {state?.step || 0}</p>
              </div>

              {/* Live Price Indicator */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isProfitable ? "bg-emerald-500" : "bg-red-500"
                    } animate-pulse`}
                  ></div>
                  <span className="text-xs text-gray-400">LIVE</span>
                </div>
              </div>
            </div>

            {/* Cash Balance */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Cash Balance</p>
                <p className="text-lg font-bold text-emerald-400">
                  ₹
                  {(state?.portfolio.cash || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="w-px h-10 bg-gray-800"></div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Holdings</p>
                <p className="text-lg font-bold text-white">
                  {state?.portfolio.shares || 0} shares
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action message (success / error) */}
      {actionMessage && (
        <div className={`max-w-7xl mx-auto px-6 py-4`}>
          <div
            className={`rounded-lg p-3 text-sm font-medium ${
              actionMessageType === "error"
                ? "bg-red-800 text-red-200 border border-red-700"
                : "bg-emerald-800 text-emerald-100 border border-emerald-700"
            }`}
          >
            {actionMessage}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Price Overview Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-8 mb-6 shadow-2xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <h2 className="text-5xl font-bold text-white">
                  ₹{(state?.price || 0).toFixed(2)}
                </h2>
                {priceHistory.length > 1 && (
                  <span
                    className={`text-xl font-semibold ${
                      priceChange >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {priceChange >= 0 ? "+" : ""}₹{priceChange.toFixed(2)} (
                    {priceChange >= 0 ? "+" : ""}
                    {priceChangePercent}%)
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm">Current Market Price</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Avg. Buy Price</p>
                <p className="text-lg font-semibold text-white">
                  ₹{(state?.portfolio.avgBuyPrice || 0).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Market Value</p>
                <p className="text-lg font-semibold text-white">
                  ₹
                  {(
                    (state?.portfolio.shares || 0) * (state?.price || 0)
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Unrealized P&L</p>
                <p
                  className={`text-lg font-semibold ${
                    isProfitable ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isProfitable ? "+" : ""}₹
                  {(state?.portfolio.unrealizedPnl || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-96 -mx-2">
            {priceHistory.length >= 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={priceHistory}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={chartColor}
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="100%"
                        stopColor={chartColor}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1f2937"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="step"
                    stroke="#4b5563"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={{ stroke: "#374151" }}
                    tickLine={{ stroke: "#374151" }}
                    label={{
                      value: "Step",
                      position: "insideBottom",
                      offset: -5,
                      fill: "#6b7280",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    stroke="#4b5563"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={{ stroke: "#374151" }}
                    tickLine={{ stroke: "#374151" }}
                    domain={["auto", "auto"]}
                    tickFormatter={(value) => `₹${value.toFixed(0)}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                    }}
                    labelStyle={{
                      color: "#9ca3af",
                      fontSize: "12px",
                      marginBottom: "4px",
                    }}
                    itemStyle={{
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                    formatter={(value, name) => [
                      `₹${value.toFixed(2)}`,
                      "Price",
                    ]}
                    labelFormatter={(label) => `Step ${label}`}
                  />
                  {priceHistory.length > 0 && (
                    <ReferenceLine
                      y={priceHistory[0].price}
                      stroke="#6b7280"
                      strokeDasharray="5 5"
                      strokeWidth={1}
                      label={{
                        value: "Start",
                        position: "insideTopRight",
                        fill: "#6b7280",
                        fontSize: 10,
                      }}
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={chartColor}
                    strokeWidth={2.5}
                    fill="url(#colorGradient)"
                    dot={priceHistory.length <= 10}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: chartColor }}
                    animationDuration={500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg
                  className="w-16 h-16 mb-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-lg font-medium">Chart Loading</p>
                <p className="text-sm text-gray-600 mt-1">
                  Initializing market data...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Trading Actions */}
        <div className="grid grid-cols-3 gap-4">
          {/* Buy Button */}
          <button
            onClick={() => sendAction("BUY", 10)}
            disabled={state?.portfolio.cash < state?.price * 10}
            className="group relative bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-semibold py-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 active:scale-95 disabled:active:scale-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex flex-col items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-lg">Buy 10</span>
              <span className="text-xs opacity-75">
                ₹{((state?.price || 0) * 10).toFixed(2)}
              </span>
            </div>
          </button>

          {/* Hold Button */}
          <button
            onClick={() => sendAction("HOLD")}
            className="group relative bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gray-500/20 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex flex-col items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-lg">Hold</span>
              <span className="text-xs opacity-75">Skip this step</span>
            </div>
          </button>

          {/* Sell Button */}
          <button
            onClick={() =>
              sendAction("SELL", Math.min(10, state?.portfolio.shares || 0))
            }
            disabled={(state?.portfolio.shares || 0) <= 0}
            className="group relative bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-semibold py-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/30 active:scale-95 disabled:active:scale-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex flex-col items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M20 12H4"
                />
              </svg>
              <span className="text-lg">Sell 10</span>
              <span className="text-xs opacity-75">
                ₹{((state?.price || 0) * 10).toFixed(2)}
              </span>
            </div>
          </button>
        </div>

        {/* Info Footer */}
        <div className="text-center mt-8 text-gray-500 text-xs">
          <p>
            Make strategic trades to maximize your portfolio value • Market
            updates with each action
          </p>
        </div>
      </div>
    </div>
  );
}
