const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


//--------------   Connection String   ------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.chteo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        //--------------   Database Connect ------------------
        await client.connect();

        //--------------   Connect with Databases   ------------------
        const database = client.db('toEuropa');
        const offersCollections = database.collection('offers');
        const packagesCollections = database.collection('packages');
        const ordersCollections = database.collection('orders');

        //--------------   Get All Offers   ------------------
        app.get('/offers', async (req, res) => {
            const cursor = offersCollections.find({});
            const offers = await cursor.toArray();
            res.send(offers);
        });

        //--------------   Get All Packages    ------------------
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollections.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });

        //--------------   Get Package using Id    ------------------
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const package = await packagesCollections.findOne(query);
            res.json(package);
        });

        //--------------   Insert New Package    ------------------
        app.post('/package', async (req, res) => {
            const packageDetails = req.body;
            const result = await packagesCollections.insertOne(packageDetails);
            res.send(result)
        });

        //--------------   Insert New Booking    ------------------
        app.post('/booking', async (req, res) => {
            const orderDetails = req.body;
            const result = await ordersCollections.insertOne(orderDetails);
            res.send(result)
        });


        //--------------   Get All Orders    ------------------
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollections.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });


        //--------------   Get Order Details Using Email    ------------------
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const cursor = await ordersCollections.find({ user: email });
            const orders = await cursor.toArray();
            res.json(orders);
        });


        //--------------   Get Order Details Using Id    ------------------
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollections.deleteOne(query);
            res.json(result);
        });


         //--------------   Update Status Using Id    ------------------
         app.get('/orderUpdate/:id', async (req, res) => {
            const id = req.params.id;            
            const filter = { _id: ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: "approved"                    
                },
            };
            const result = await ordersCollections.updateOne(filter, updateDoc, options);           
            res.json(result)
        })
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