require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/diorise";

mongoose.connect(MONGO_URI)
  .then(()=>console.log("✅ MongoDB connected"))
  .catch(err=>{
    console.error("❌ Mongo error", err);
    process.exit(1);
  });

const PlayerSchema = new mongoose.Schema({
  nick: { type:String, unique:true, required:true },
  points:{ type:Number, default:0 },
  pps:{ type:Number, default:0 },
  mult:{ type:Number, default:1 },
  level:{ type:Number, default:1 },
  lastOnline:{ type:Number, default:Date.now }
});

const Player = mongoose.model("Player", PlayerSchema);

// ===== LOGIN =====
app.post("/login", async (req,res)=>{
  const { nick } = req.body;
  if(!nick || nick.length < 2){
    return res.status(400).json({ error:"Неверный ник" });
  }

  let player = await Player.findOne({ nick });
  if(!player){
    player = await Player.create({ nick });
    console.log("🆕 New player:", nick);
  }

  player.lastOnline = Date.now();
  await player.save();

  res.json(player);
});

// ===== SAVE =====
app.post("/save", async (req,res)=>{
  if(!req.body.nick){
    return res.status(400).json({ error:"No nick" });
  }
  await Player.updateOne({ nick:req.body.nick }, req.body);
  res.json({ ok:true });
});

// ===== HEALTH =====
app.get("/health",(req,res)=>res.json({ ok:true }));

app.listen(PORT, ()=>console.log("🚀 http://localhost:"+PORT));