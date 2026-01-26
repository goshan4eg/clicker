require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

/* ================= STORAGE ================= */
const DATA_FILE = path.join(__dirname, "players.json");

let players = {};

// загрузка из файла
if (fs.existsSync(DATA_FILE)) {
  try {
    players = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    console.log("📂 Players loaded:", Object.keys(players).length);
  } catch (e) {
    console.error("❌ players.json broken, reset");
    players = {};
  }
}

// сохранение в файл
function savePlayers() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(players, null, 2));
}

/* ================= LOGIN ================= */
app.post("/login", (req, res) => {
  const { nick } = req.body;

  if (!nick || nick.length < 2) {
    return res.status(400).json({ error: "Неверный ник" });
  }

  if (!players[nick]) {
    players[nick] = {
      nick,
      gold: 0,
      level: 1,
      xp: 0,
      stats: { str: 1, agi: 1, int: 1, luck: 1 },
      perSec: 0,
      lastOnline: Date.now()
    };
    console.log("🆕 Новый игрок:", nick);
  } else {
    players[nick].lastOnline = Date.now();
  }

  savePlayers();
  res.json(players[nick]);
});

/* ================= SAVE ================= */
app.post("/save", (req, res) => {
  const { nick } = req.body;
  if (!nick || !players[nick]) {
    return res.status(400).json({ error: "Игрок не найден" });
  }

  players[nick] = {
    ...players[nick],
    ...req.body,
    lastOnline: Date.now()
  };

  savePlayers();
  res.json({ ok: true });
});

/* ================= LEADERS ================= */
app.get("/leaders", (req, res) => {
  const list = Object.values(players)
    .sort((a, b) => b.gold - a.gold)
    .slice(0, 10)
    .map(p => ({
      nick: p.nick,
      gold: p.gold,
      level: p.level
    }));

  res.json(list);
});

/* ================= HEALTH ================= */
app.get("/health", (req, res) => {
  res.json({ ok: true, players: Object.keys(players).length });
});

/* ================= START ================= */
app.listen(PORT, () => {
  console.log("🚀 Server started on http://localhost:" + PORT);
});