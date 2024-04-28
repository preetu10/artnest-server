const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port=process.env.PORT ||5000;
app.use(express.json());
app.use(cors());

app.get('/', (req,res)=>{
    res.send("ArtNest running is running on server");
});



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fxxuhv1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
   
    const database=client.db("art-nest");
    const crafts=database.collection("crafts");

    app.get('/', (req,res)=>{
        res.send("ArtNest running is running on server");
    });
    
    app.post("/add-crafts",async(req, res)=>{
        const item=req.body;
        const result=await crafts.insertOne(item);
        res.send(result);
    })

  } finally {
  }
}
run().catch(console.dir);


app.listen(port,()=>{
    console.log("my app listening");
})