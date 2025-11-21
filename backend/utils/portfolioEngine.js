// utils/portfolioEngine.js

/**
 * Simple portfolio model:
 * - cash (starts with some amount)
 * - shares (number of shares held)
 * - avgBuyPrice (weighted average)
 * - realizedPnl
 * - unrealizedPnl (calculated given current price)
 */

const STARTING_CASH = 10000;

export function initPortfolio(startPrice) {
  return {
    cash: STARTING_CASH,
    shares: 0,
    avgBuyPrice: 0,
    realizedPnl: 0,
    lastPrice: startPrice
  };
}

/**
 * Apply a user action
 * action: 'BUY' | 'SELL' | 'HOLD'
 * quantity: number of shares (positive integer)
 * price: current price
 *
 * returns info about what happened
 */
export function applyAction(portfolio, action, quantity, price) {
  const q = Math.max(0, Math.floor(quantity));

  if (action === "BUY" && q > 0) {
    const cost = q * price;
    if (cost > portfolio.cash) {
      return { success: false, reason: "Insufficient cash" };
    }
    // update average buy price
    const totalCostExisting = portfolio.avgBuyPrice * portfolio.shares;
    const totalCostNew = cost;
    const newShareCount = portfolio.shares + q;
    portfolio.avgBuyPrice = newShareCount > 0 ? (totalCostExisting + totalCostNew) / newShareCount : 0;
    portfolio.shares = newShareCount;
    portfolio.cash -= cost;
  } else if (action === "SELL" && q > 0) {
    const sellQty = Math.min(q, portfolio.shares);
    if (sellQty === 0) return { success: false, reason: "No shares to sell" };
    const proceed = sellQty * price;
    // realized pnl = proceeds - cost basis for sold shares
    const costBasis = sellQty * portfolio.avgBuyPrice;
    const pnl = proceed - costBasis;
    portfolio.realizedPnl += pnl;
    portfolio.shares -= sellQty;
    portfolio.cash += proceed;
    if (portfolio.shares === 0) {
      portfolio.avgBuyPrice = 0;
    }
  } else if (action === "HOLD") {
    // nothing to do
  } else {
    return { success: false, reason: "Invalid action or quantity" };
  }

  // update lastPrice and unrealized PnL
  portfolio.lastPrice = price;
  const unrealizedPnl = portfolio.shares * (portfolio.lastPrice - portfolio.avgBuyPrice);
  const totalValue = portfolio.cash + (portfolio.shares * portfolio.lastPrice);

  return {
    success: true,
    portfolio: { ...portfolio },
    unrealizedPnl,
    totalValue
  };
}
