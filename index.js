const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.chteo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db('toEuropa');
        const offersCollections = database.collection('offers');
        const packagesCollections = database.collection('packages');
        const ordersCollections = database.collection('orders');

        app.get('/offers', async (req, res) => {
            const cursor = offersCollections.find({});
            const offers = await cursor.toArray();
            res.send(offers);
        });

        app.get('/packages', async (req, res) => {
            const cursor = packagesCollections.find({});            
            const packages = await cursor.toArray();
            res.send(packages);
        });

        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;                      
            const query = {_id: ObjectId(id)}
            const package = await packagesCollections.findOne(query);
            res.json(package);
        });

        //Post API
        app.post('/booking', async (req, res) => {
            const orderDetails = req.body;   
            const result = await ordersCollections.insertOne(orderDetails);            
            res.send(result)
        });
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Server is running");
});

app.listen(port, () => {
    console.log("Server is running on Port", port);
})