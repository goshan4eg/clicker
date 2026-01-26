// POST /api/shop/buy
app.post("/api/shop/buy", auth, async(req,res)=>{
  const user = await User.findOne({ nick:req.session.user });

  if(req.body.item === "xp_boost_2x"){
    if(user.coins < 50) return res.json({error:"no_coins"});
    user.coins -= 50;
    user.xpBoost = 2;
  }

  await user.save();
  res.json({ ok:true, xpBoost:user.xpBoost, coins:user.coins });
});