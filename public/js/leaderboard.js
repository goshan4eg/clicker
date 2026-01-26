/* ======================================================
   DioClicker — LEADERBOARD UI
====================================================== */

const REFRESH_INTERVAL = 15000; // 15 сек

document.addEventListener("DOMContentLoaded", () => {
  loadLeaderboard();
  setInterval(loadLeaderboard, REFRESH_INTERVAL);
});

async function loadLeaderboard() {
  try {
    const res = await fetch("/api/game/leaderboard");
    const data = await res.json();

    const root = document.getElementById("leaderboard-list");
    if (!root) return;

    root.innerHTML = "";

    data.forEach((u, i) => {
      const row = document.createElement("div");
      row.className = "leaderboard-row";

      row.innerHTML = `
        <span>${i + 1}</span>
        <span class="${nickClass(u.level)}">${escape(u.nick)}</span>
        <span>LVL ${u.level}</span>
        <span>${u.xp}</span>
      `;

      root.appendChild(row);
    });

  } catch (e) {
    console.error("Leaderboard error", e);
  }
}

function nickClass(level) {
  if (level >= 50) return "nick-lvl-50";
  if (level >= 30) return "nick-lvl-30";
  if (level >= 20) return "nick-lvl-20";
  if (level >= 10) return "nick-lvl-10";
  if (level >= 5) return "nick-lvl-5";
  return "nick-lvl-1";
}

function escape(str) {
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}