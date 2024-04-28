const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    app.get('/get-all-crafts', async(req,res)=>{
        const cursor= crafts.find();
        const result= await cursor.toArray();
        res.send(result);
    });

    app.get('/get-my-crafts/:email',async(req, res)=>{
        const email=req.params.email;
        const query = { email: email };
          const cursor = crafts.find(query);
          const result=await cursor.toArray();
          res.send(result);

    })
    app.get('/update-craft-view/:id',async(req, res)=>{
        const id=req.params.id;
        const query = { _id: new ObjectId(id) };
        const cursor = await crafts.findOne(query);
        const result= cursor;
        res.send(result);
    })

    app.post("/add-crafts",async(req, res)=>{
        const item=req.body;
        const result=await crafts.insertOne(item);
        res.send(result);
    })

    app.put("/update-craft/:id",async(req, res)=>{
        const id=req.params.id;
        const updatedData=req.body;
        const filter={_id:new ObjectId(id)};
        const updateCraft={
            $set:{
                item_name:updatedData.item_name,
                item_photo:updatedData.item_photo,
                item_description:updatedData.item_description,
                item_processing_time:updatedData.item_processing_time,
                item_price:updatedData.item_price,
                item_rating:updatedData.item_rating,
                customization:updatedData.customization,
                stockStatus:updatedData.stockStatus,
                category:updatedData.category,
                name:updatedData.name,
                email:updatedData.email
            }
        }
        const result=await crafts.updateOne(filter,updateCraft);
        res.send(result);
    })

    app.delete("/delete-craft/:id",async(req, res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)};
        const result=await crafts.deleteOne(query);
        res.send(result);
    })

  } finally {
  }
}
run().catch(console.dir);


app.listen(port,()=>{
    console.log("my app listening");
})