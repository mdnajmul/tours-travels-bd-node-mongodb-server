const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();

//PORT
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3u7yr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("tours_travels_bd");
    const tourPackageCollection = database.collection("tour_packages");
    const tourBookingCollection = database.collection("orders");

    //GET API (Fetch all tour packages from database)
    app.get("/tourpackages", async (req, res) => {
      const cursor = tourPackageCollection.find({});
      const tour_packages = await cursor.toArray();
      res.send(tour_packages);
    });

    // get single tour package
    app.get("/tourpackages/:id", async (req, res) => {
      const result = await tourPackageCollection
        .find({ _id: ObjectId(req.params.id) })
        .toArray();
      res.send(result[0]);
    });

    //add tourpackage
    app.post("/addtourpackage", async (req, res) => {
      const result = await tourPackageCollection.insertOne(req.body);
      res.json(result);
    });

    // cofirm order
    app.post("/confirmOrder", async (req, res) => {
      const result = await tourBookingCollection.insertOne(req.body);
      res.send(result);
    });

    // get all myOrders
    app.get("/myOrders/:email", async (req, res) => {
      const email = req.params.email;
      const result = await tourBookingCollection
        .find({ email: email })
        .toArray();
      res.send(result);
    });

    //get all order
    app.get("/allOrders", async (req, res) => {
      const result = await tourBookingCollection.find({}).toArray();
      res.send(result);
    });

    // delete order
    app.delete("/delteOrder/:id", async (req, res) => {
      const result = await tourBookingCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    // update status
    app.put("/updateStatus/:id", (req, res) => {
      const id = req.params.id;
      const updatedStatus = "approved";
      const filter = { _id: ObjectId(id) };
      console.log(updatedStatus);
      tourBookingCollection
        .updateOne(filter, {
          $set: { status: updatedStatus },
        })
        .then((result) => {
          console.log(result);
          res.send(result);
        });
    });
  } finally {
    //   await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tours Travels BD Node Server Connect.");
});

app.listen(port, () => {
  console.log("Server running at port ", port);
});
