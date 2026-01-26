/* ======================================================
   DioClicker — UI LOGIC
   - автогенерация Skill Tree
   - обновление UI
   - анимации
====================================================== */

import { SKILLS, canUpgradeSkill, upgradeSkill } from "./skills.js";
import {
  gameState,
  getXPForLevel,
  getLevelProgress,
  getXPToNextLevel
} from "./core.js";

/* ================== INIT ================== */

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
});

/* ================== GLOBAL RENDER ================== */

export function renderAll() {
  renderHeader();
  renderProgress();
  renderStats();
  renderSkillTree();
}

/* ================== HEADER ================== */

function renderHeader() {
  const el = document.getElementById("player-level");
  if (el) el.textContent = gameState.level;
}

/* ================== LEVEL PROGRESS ================== */

function renderProgress() {
  const xpBar = document.getElementById("xp-bar");
  const xpText = document.getElementById("xp-text");
  const xpLeft = document.getElementById("xp-left");

  if (!xpBar) return;

  const need = getXPForLevel(gameState.level);
  const progress = getLevelProgress();

  xpBar.style.width = `${progress * 100}%`;
  xpText.textContent = `${Math.floor(gameState.xp)} / ${need}`;
  xpLeft.textContent = `До уровня: ${getXPToNextLevel()} XP`;
}

/* ================== STATS ================== */

function renderStats() {
  const map = {
    clickPower: "stat-click",
    passiveXP: "stat-passive",
    intelligence: "stat-int",
    strength: "stat-str",
    critChance: "stat-crit",
    critMultiplier: "stat-critdmg"
  };

  for (const key in map) {
    const el = document.getElementById(map[key]);
    if (el) el.textContent = formatStat(key, gameState.stats[key]);
  }
}

function formatStat(key, val) {
  if (key === "critChance") return `${Math.round(val * 100)}%`;
  if (key === "critMultiplier") return `x${val.toFixed(2)}`;
  return val;
}

/* ================== SKILL TREE ================== */

function renderSkillTree() {
  const root = document.getElementById("skill-tree");
  if (!root) return;

  root.innerHTML = "";

  Object.entries(SKILLS).forEach(([id, skill]) => {
    const level = gameState.skills[id] || 0;
    const locked = !canUpgradeSkill(id);
    const maxed = level >= skill.maxLevel;
    const cost = !maxed ? skill.cost(level + 1) : "MAX";

    const card = document.createElement("div");
    card.className = `skill-card ${locked ? "locked" : ""} ${
      maxed ? "maxed" : ""
    }`;

    card.innerHTML = `
      <div class="skill-header">
        <span class="skill-name">${skill.name}</span>
        <span class="skill-level">${level}/${skill.maxLevel}</span>
      </div>

      <div class="skill-bar">
        <div style="width:${(level / skill.maxLevel) * 100}%"></div>
      </div>

      <div class="skill-footer">
        <span class="skill-cost">${
          maxed ? "Макс." : cost + " XP"
        }</span>
        <button ${locked || maxed ? "disabled" : ""}>
          ${maxed ? "MAX" : "Ап"}
        </button>
      </div>
    `;

    const btn = card.querySelector("button");
    if (btn && !locked && !maxed) {
      btn.onclick = () => {
        const ok = upgradeSkill(id);
        if (ok) {
          animateSkillUp(card);
          renderAll();
        }
      };
    }

    root.appendChild(card);
  });
}

/* ================== ANIMATIONS ================== */

function animateSkillUp(card) {
  card.classList.add("skill-up");
  setTimeout(() => card.classList.remove("skill-up"), 400);
}

/* ================== LEVEL UP EVENT ================== */

document.addEventListener("levelup", (e) => {
  showLevelUpFX(e.detail.level);
  renderAll();
});

function showLevelUpFX(level) {
  const fx = document.createElement("div");
  fx.className = "levelup-fx";
  fx.innerHTML = `<div>LEVEL ${level}</div>`;
  document.body.appendChild(fx);

  setTimeout(() => fx.remove(), 900);
}