import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app=express(), port=process.env.PORT||3000;
app.use(express.json({limit:"1mb"}));
app.use(express.static("public"));
app.get("/api/health",(req,res)=>res.json({ok:true,aiConfigured:!!process.env.OPENAI_API_KEY}));
app.post("/api/roadmap",async(req,res)=>{
 const {topic,level="Beginner",duration=30,dailyMinutes=30,style="Balanced"}=req.body||{};
 if(typeof topic!=="string"||topic.trim().length<2||topic.length>180)return res.status(400).json({error:"Enter a valid topic."});
 if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:"AI key not configured; use demo generator."});
 try{
  const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-4o-mini",temperature:.6,response_format:{type:"json_object"},messages:[{role:"system",content:'Return JSON only: {"lessons":[{"title":"...","summary":"...","objective":"...","minutes":20,"content":"lesson explanation with example","quiz":[{"q":"...","options":["A","B","C","D"],"answer":0,"explanation":"..."}]}]}. Make 5 sequential lessons, 3 multiple choice questions per lesson, answer is zero-based. Adapt to level and duration. Be accurate and beginner friendly.'},{role:"user",content:JSON.stringify({topic:topic.trim(),level,duration,dailyMinutes,style})}]})});
  const d=await r.json();if(!r.ok)return res.status(502).json({error:d?.error?.message||"AI provider error"});
  const data=JSON.parse(d.choices?.[0]?.message?.content||"{}");if(!Array.isArray(data.lessons)||!data.lessons.length)throw Error("Invalid AI output");
  res.json({lessons:data.lessons.slice(0,8).map(l=>({...l,title:String(l.title||"Lesson").slice(0,150),minutes:Math.min(180,Math.max(5,Number(l.minutes)||20)),quiz:Array.isArray(l.quiz)?l.quiz.slice(0,5):[]}))});
 }catch(e){console.error(e);res.status(502).json({error:"Could not generate a roadmap. Check your API key and try again."})}
});
app.get("*",(req,res)=>res.sendFile(process.cwd()+"/public/index.html"));
app.listen(port,()=>console.log("PathWise running on "+port));
