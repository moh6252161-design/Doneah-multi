const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");
const { Configuration, OpenAIApi }=require("openai");
require("dotenv").config();

const app=express();
app.use(cors());
app.use(bodyParser.json());

const configuration=new Configuration({ apiKey:process.env.OPENAI_API_KEY });
const openai=new OpenAIApi(configuration);

app.post("/api/chatIA", async(req,res)=>{
  const { message }=req.body;
  try{
    const response=await openai.createChatCompletion({
      model:"gpt-3.5-turbo",
      messages:[{ role:"user", content:message }],
      max_tokens:150
    });
    res.json({ reply:response.data.choices[0].message.content.trim() });
  }catch(err){
    console.error(err);
    res.json({ reply:"Désolé, je n'ai pas pu répondre." });
  }
});

app.use(express.static("."));
const PORT=3000;
app.listen(PORT, ()=>console.log(`Serveur démarré sur http://localhost:${PORT}`));
