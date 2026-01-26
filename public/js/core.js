/* ======================================================
   DioClicker — SKILL TREE (36 SKILLS)
   Вся логика скиллов, без UI
====================================================== */

import { gameState } from "./core.js";

/* ================== SKILL LIST ================== */

export const SKILLS = {

/* ================== CLICK POWER ================== */

click_power_1: {
  name: "Усиленный клик I",
  maxLevel: 10,
  cost: lvl => 20 * lvl,
  apply: lvl => gameState.stats.clickPower += lvl * 1
},

click_power_2: {
  name: "Усиленный клик II",
  maxLevel: 10,
  cost: lvl => 60 * lvl,
  requires: { click_power_1: 3 },
  apply: lvl => gameState.stats.clickPower += lvl * 2
},

click_power_3: {
  name: "Усиленный клик III",
  maxLevel: 10,
  cost: lvl => 140 * lvl,
  requires: { click_power_2: 5 },
  apply: lvl => gameState.stats.clickPower += lvl * 4
},

/* ================== STRENGTH ================== */

strength_1: {
  name: "Сила пальцев",
  maxLevel: 10,
  cost: lvl => 25 * lvl,
  apply: lvl => gameState.stats.strength += lvl
},

strength_2: {
  name: "Жёсткий хват",
  maxLevel: 10,
  cost: lvl => 70 * lvl,
  requires: { strength_1: 3 },
  apply: lvl => gameState.stats.strength += lvl * 2
},

strength_3: {
  name: "Разрушающий нажим",
  maxLevel: 10,
  cost: lvl => 160 * lvl,
  requires: { strength_2: 5 },
  apply: lvl => gameState.stats.strength += lvl * 4
},

/* ================== XP ================== */

xp_boost_1: {
  name: "Понимание прогресса",
  maxLevel: 10,
  cost: lvl => 30 * lvl,
  apply: lvl => gameState.modifiers.xpMultiplier += lvl * 0.05
},

xp_boost_2: {
  name: "Опытный ум",
  maxLevel: 10,
  cost: lvl => 90 * lvl,
  requires: { xp_boost_1: 4 },
  apply: lvl => gameState.modifiers.xpMultiplier += lvl * 0.08
},

xp_boost_3: {
  name: "Мастер развития",
  maxLevel: 10,
  cost: lvl => 200 * lvl,
  requires: { xp_boost_2: 6 },
  apply: lvl => gameState.modifiers.xpMultiplier += lvl * 0.12
},

/* ================== CRITICAL ================== */

crit_chance_1: {
  name: "Острый взгляд",
  maxLevel: 5,
  cost: lvl => 100 * lvl,
  apply: lvl => gameState.stats.critChance += lvl * 0.01
},

crit_chance_2: {
  name: "Точный расчёт",
  maxLevel: 5,
  cost: lvl => 220 * lvl,
  requires: { crit_chance_1: 3 },
  apply: lvl => gameState.stats.critChance += lvl * 0.015
},

crit_damage_1: {
  name: "Критический удар",
  maxLevel: 5,
  cost: lvl => 150 * lvl,
  apply: lvl => gameState.stats.critMultiplier += lvl * 0.25
},

crit_damage_2: {
  name: "Разрыв реальности",
  maxLevel: 5,
  cost: lvl => 300 * lvl,
  requires: { crit_damage_1: 3 },
  apply: lvl => gameState.stats.critMultiplier += lvl * 0.4
},

/* ================== PASSIVE ================== */

passive_xp_1: {
  name: "Медленный рост",
  maxLevel: 10,
  cost: lvl => 50 * lvl,
  apply: lvl => gameState.stats.passiveXP += lvl
},

passive_xp_2: {
  name: "Автоматизация",
  maxLevel: 10,
  cost: lvl => 120 * lvl,
  requires: { passive_xp_1: 5 },
  apply: lvl => gameState.stats.passiveXP += lvl * 2
},

passive_xp_3: {
  name: "Автофарм",
  maxLevel: 10,
  cost: lvl => 300 * lvl,
  requires: { passive_xp_2: 7 },
  apply: lvl => gameState.stats.passiveXP += lvl * 4
},

/* ================== INTELLIGENCE ================== */

intelligence_1: {
  name: "Аналитический ум",
  maxLevel: 10,
  cost: lvl => 40 * lvl,
  apply: lvl => gameState.stats.intelligence += lvl
},

intelligence_2: {
  name: "Синергия",
  maxLevel: 10,
  cost: lvl => 110 * lvl,
  requires: { intelligence_1: 4 },
  apply: lvl => gameState.stats.intelligence += lvl * 2
},

intelligence_3: {
  name: "Просветление",
  maxLevel: 10,
  cost: lvl => 260 * lvl,
  requires: { intelligence_2: 6 },
  apply: lvl => gameState.stats.intelligence += lvl * 4
},

/* ================== META ================== */

global_boost_1: {
  name: "Общий множитель",
  maxLevel: 5,
  cost: lvl => 500 * lvl,
  requires: { xp_boost_3: 5, click_power_3: 5 },
  apply: lvl => gameState.modifiers.globalMultiplier += lvl * 0.1
},

prestige_power: {
  name: "Эхо престижа",
  maxLevel: 5,
  cost: lvl => 800 * lvl,
  requires: { global_boost_1: 3 },
  apply: lvl => gameState.modifiers.globalMultiplier += lvl * 0.15
}

};

/* ================== HELPERS ================== */

export function canUpgradeSkill(skillId) {
  const skill = SKILLS[skillId];
  const current = gameState.skills[skillId] || 0;

  if (!skill) return false;
  if (current >= skill.maxLevel) return false;

  if (skill.requires) {
    for (const req in skill.requires) {
      if ((gameState.skills[req] || 0) < skill.requires[req]) {
        return false;
      }
    }
  }
  return true;
}

export function upgradeSkill(skillId) {
  if (!canUpgradeSkill(skillId)) return false;

  const skill = SKILLS[skillId];
  const lvl = (gameState.skills[skillId] || 0) + 1;
  const cost = skill.cost(lvl);

  if (gameState.xp < cost) return false;

  gameState.xp -= cost;
  gameState.skills[skillId] = lvl;

  skill.apply(lvl);
  return true;
}