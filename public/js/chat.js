/* ======================================================
   DioClicker — REALTIME CHAT (Socket.IO)
   Клиентская часть
====================================================== */

import { gameState } from "./core.js";

/* ================== SOCKET ================== */

const socket = io(); // /socket.io/socket.io.js

/* ================== ELEMENTS ================== */

let chatLog;
let chatInput;
let nickInput;
let onlineCounter;

/* ================== INIT ================== */

document.addEventListener("DOMContentLoaded", () => {
  chatLog = document.getElementById("chatlog");
  chatInput = document.getElementById("chat-input");
  nickInput = document.getElementById("chat-nick");

  createOnlineCounter();
  bindInput();
});

/* ================== ONLINE ================== */

function createOnlineCounter() {
  onlineCounter = document.createElement("div");
  onlineCounter.className = "chat-online";
  onlineCounter.textContent = "Онлайн: 1";
  document.querySelector(".chat").prepend(onlineCounter);
}

socket.on("online", count => {
  if (onlineCounter) {
    onlineCounter.textContent = `Онлайн: ${count}`;
  }
});

/* ================== INPUT ================== */

function bindInput() {
  if (!chatInput) return;

  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && chatInput.value.trim()) {
      sendMessage(chatInput.value.trim());
      chatInput.value = "";
    }
  });
}

function sendMessage(text) {
  const nick = nickInput.value.trim() || "Игрок";

  socket.emit("chat:message", {
    nick,
    level: gameState.level,
    text
  });
}

/* ================== RECEIVE ================== */

socket.on("chat:message", data => {
  addMessage(data.nick, data.level, data.text);
});

/* ================== UI ================== */

function addMessage(nick, level, text) {
  const msg = document.createElement("div");

  const lvlClass = getNickClass(level);

  msg.innerHTML = `
    <span class="${lvlClass}">${escape(nick)}</span>
    <span class="chat-text">: ${escape(text)}</span>
  `;

  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
}

/* ================== HELPERS ================== */

function getNickClass(level) {
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