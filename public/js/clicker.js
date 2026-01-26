/* ======================================================
   DioClicker — CLICKER MODULE
   Отвечает за:
   - обработку клика
   - привязку кнопки TAP
   - тактильный и визуальный отклик
====================================================== */

import {
  gameState,
  calculateClickXP,
  addXP
} from "./core.js";

import { renderAll } from "./ui.js";

/* ================== INIT ================== */

document.addEventListener("DOMContentLoaded", () => {
  bindClickButton();
});

/* ================== BIND ================== */

function bindClickButton() {
  const btn = document.getElementById("click-btn");
  if (!btn) {
    console.warn("[Clicker] Кнопка клика не найдена");
    return;
  }

  btn.addEventListener("click", onClick);
}

/* ================== CLICK LOGIC ================== */

function onClick() {
  const gainedXP = calculateClickXP();

  // мета-статистика
  gameState.meta.clicks++;

  // добавляем XP (вся логика уровней внутри core.js)
  addXP(gainedXP);

  // эффекты
  pulseButton();
  spawnFloatingXP(gainedXP);
  haptic();

  // обновление UI
  renderAll();
}

/* ================== FX ================== */

function pulseButton() {
  const btn = document.getElementById("click-btn");
  if (!btn) return;

  btn.classList.add("pulse");
  setTimeout(() => btn.classList.remove("pulse"), 250);
}

function spawnFloatingXP(amount) {
  const btn = document.getElementById("click-btn");
  if (!btn) return;

  const el = document.createElement("div");
  el.className = "floating-xp";
  el.textContent = `+${amount}`;

  const rect = btn.getBoundingClientRect();
  el.style.left = rect.left + rect.width / 2 + "px";
  el.style.top = rect.top + "px";

  document.body.appendChild(el);

  setTimeout(() => el.remove(), 900);
}

function haptic() {
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
}