export async function requestWithdraw(req,res){
  try{
    const { telegramId, amount, binanceUID } = req.body;
    if(!telegramId) return res.status(400).json({error:"telegramId required"});
    if(!amount) return res.status(400).json({error:"Amount required"});
    if(!binanceUID) return res.status(400).json({error:"Binance UID required"});
    
    const user = await User.findOne({ telegramId });
    if(!user) return res.status(404).json({error:"User not found"});
    if(amount < MIN_WITHDRAW) return res.status(400).json({error:`Minimum withdraw ${MIN_WITHDRAW} tokens`});
    if(amount > user.tokens) return res.status(400).json({error:"Insufficient tokens"});

    user.tokens -= amount;
    await user.save();

    const w = await Withdraw.create({ telegramId, amount, binanceUID, status:"pending" });
    return res.json({ success:true, withdraw:w, user });
  }catch(e){ console.error(e); return res.status(500).json({error:"Server error"});}
}
