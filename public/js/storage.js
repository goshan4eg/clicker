/* ======================================================
   DioClicker — STORAGE SYSTEM
   - сохранение / загрузка всего состояния
   - versioning
   - защита от поломки сейвов
====================================================== */

import { gameState } from "./core.js";

/* ================== CONFIG ================== */

const STORAGE_KEY = "dioclicker_save";
const SAVE_VERSION = 1;
const AUTOSAVE_INTERVAL = 5000; // 5 секунд

/* ================== SAVE / LOAD ================== */

/**
 * Сохранить состояние
 */
export function saveGame() {
  try {
    const payload = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      state: structuredClone(gameState)
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("Save error:", err);
  }
}

/**
 * Загрузить состояние
 */
export function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const data = JSON.parse(raw);

    if (!data.state || data.version !== SAVE_VERSION) {
      console.warn("Save version mismatch, ignored");
      return false;
    }

    restoreState(data.state);
    return true;
  } catch (err) {
    console.error("Load error:", err);
    return false;
  }
}

/* ================== RESTORE ================== */

/**
 * Аккуратное восстановление state
 * (чтобы новые поля не ломали старые сейвы)
 */
function restoreState(saved) {
  merge(gameState, saved);
}

/**
 * Глубокий merge объектов
 */
function merge(target, source) {
  for (const key in source) {
    if (
      typeof source[key] === "object" &&
      source[key] !== null &&
      !Array.isArray(source[key])
    ) {
      if (!target[key]) target[key] = {};
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

/* ================== AUTO SAVE ================== */

// автосейв
setInterval(saveGame, AUTOSAVE_INTERVAL);

// сейв при закрытии вкладки
window.addEventListener("beforeunload", saveGame);

/* ================== INIT ================== */

// пробуем загрузить сейв сразу
loadGame();