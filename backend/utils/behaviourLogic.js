// utils/behaviourLogic.js

/**
 * Tag behaviours based on actions and price history.
 * Input: session { prices, actions, portfolio, step }
 * Output: array of tags (strings)
 */

export function tagBehaviours(session) {
  const tags = new Set();
  const { actions = [], prices = [] } = session;

  if (actions.length === 0) {
    tags.add("No action");
    return Array.from(tags);
  }

  // If user bought more when price dropped (averaging down)
  const buys = actions.filter(a => a.action === "BUY");
  if (buys.length >= 2) {
    // check decreasing price pattern on buys
    let averagedDown = true;
    for (let i = 1; i < buys.length; i++) {
      const prev = buys[i - 1];
      const cur = buys[i];
      if (cur.price >= prev.price) {
        averagedDown = false;
        break;
      }
    }
    if (averagedDown) tags.add("Averaged Down");
  }

  // Panic sell: sold at the lowest price in scenario
  const sells = actions.filter(a => a.action === "SELL");
  if (sells.length > 0) {
    const sellAtLowest = sells.some(s => s.price <= Math.min(...prices));
    if (sellAtLowest) tags.add("Panic Sold at Bottom");
  }

  // Diamond hands: never sold any shares during the scenario
  if (sells.length === 0 && buys.length > 0) tags.add("Long-term Hold");

  // Overtrading: more than N actions in short span
  if (actions.length >= 6) tags.add("Frequent Trading / Overtrading");

  // FOMO: bought heavily near recent high
  const recentHigh = Math.max(...prices.slice(0, Math.min(prices.length, 3)));
  const lastBuy = buys[buys.length - 1];
  if (lastBuy && lastBuy.price >= recentHigh) tags.add("Bought Near High (FOMO)");

  // Add generic tags if none detected
  if (tags.size === 0) tags.add("No obvious behavioural pattern detected");

  return Array.from(tags);
}
