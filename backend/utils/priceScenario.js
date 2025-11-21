// utils/priceScenario.js

/**
 * MVC: simple pre-defined scenarios
 */
export const scenarios = {
  crash: [100, 97, 90, 80, 85, 92, 88, 95],
  rally: [100, 105, 110, 115, 120, 130],
  volatile: [100, 98, 103, 95, 107, 100, 110, 97],
};

export function generateScenario(name = "crash") {
  return scenarios[name] ? [...scenarios[name]] : [...scenarios.crash];
}

export function getScenarioByName(name) {
  return generateScenario(name);
}
