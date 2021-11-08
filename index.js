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
