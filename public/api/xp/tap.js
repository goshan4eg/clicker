// POST /api/xp/tap
app.post("/api/xp/tap", auth, async (req,res)=>{
  const user = await User.findOne({ nick:req.session.user });

  const now = Date.now();
  const cooldown = 500; // 0.5 сек
  if(now - new Date(user.lastTap).getTime() < cooldown)
    return res.json({ error:"cooldown" });

  const baseXP = 5;
  const gained = baseXP * user.xpBoost;

  user.xp += gained;
  user.lastTap = now;

  const need = user.level * 100;
  let levelUp = false;

  if(user.xp >= need){
    user.xp -= need;
    user.level++;
    user.coins += 10;
    levelUp = true;
  }

  await user.save();

  res.json({
    xp:user.xp,
    level:user.level,
    coins:user.coins,
    levelUp,
    gained
  });
});