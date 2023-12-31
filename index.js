const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connected

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.mowydsq.mongodb.net/?retryWrites=true&w=majority`;

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
    const brandCollection = client.db("brandDB").collection("brands");
    const nameCollection = client.db("brandDB").collection("names");
    const myCartCollection = client.db("brandDB").collection("myCart");

    app.post("/brands", async(req, res) => {
      const brand = req.body;
      const result = await brandCollection.insertOne(brand);
      res.send(result);
    })

    app.get("/brands", async(req, res) => {
      const result = await brandCollection.find().toArray();
      res.send(result);
    })

    app.get("/brands/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await brandCollection.findOne(query);
      res.send(result);
    })
    
    app.put("/brands/:id", async(req, res) => {
       const id = req.params.id;
       const brand = req.body;
       const filter = {_id: new ObjectId(id)};
       const options = { upsert: true };
       const updateBrand = {
         $set: {
          name: brand.name, 
          brandName: brand.brandName,
          type: brand.type,
          price: brand.price,
          rating: brand.rating,
          shortDescription: brand.shortDescription,
          image: brand.image
         }
       }
       const result = await brandCollection.updateOne(filter, updateBrand, options);
       res.send(result);
    })

    // adding Brand name collection
    app.get("/names", async(req, res) => {
      const result = await nameCollection.find().toArray();
      res.send(result);
    })
    app.get("/names/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await nameCollection.findOne(query);
      res.send(result);
    })
    
    // My cart storing database collection
    app.post("/myCart", async(req, res) => {
      const brand = req.body;
      const result = await myCartCollection.insertOne(brand);
      res.send(result);
    })

    app.get("/myCart", async(req, res) => {
      const result = await myCartCollection.find().toArray();
      res.send(result);
    })

    app.get("/myCart/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await myCartCollection.findOne(query);
      res.send(result);
    })

    app.delete("/myCart/:id", async(req, res) => {
      const id = req.params.id;
      const query = { _id: id};
      const result = await myCartCollection.deleteOne(query);
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Hello Client!");
});

app.listen(port, (req, res) => {
    console.log(`Brand Shop is Running at ${port}`);
});