const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());

//mongodb start
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1oh7p7d.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    //collections
    const usersCollection = client.db("travlerzDB").collection("users");
    const packagesCollection = client
      .db("travlerzDB")
      .collection("tourPackages");
    const destinationsCollection = client
      .db("travlerzDB")
      .collection("destinations");

    // users Apis
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const alreadyAUser = await usersCollection.findOne(query);
      if (alreadyAUser) {
        return res.send({ message: "User Already Exist" });
      }
      user.role = "user";
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.patch("/user/:id", async (req, res) => {
      const id = req.params.id;
      const { role } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateRole = {
        $set: {
          role: role,
        },
      };
      const result = await usersCollection.updateOne(filter, updateRole);
      res.send(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // packages apis
    // view all packages
    app.get("/packages", async (req, res) => {
      const result = await packagesCollection.find().toArray();
      res.send(result);
    });
    // create / add a package
    app.post("/packages", async (req, res) => {
      const newPackages = req.body;
      newPackages.category = "new";
      const result = await packagesCollection.insertOne(newPackages);
      res.send(result);
    });
    // view single package
    app.get("/package/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await packagesCollection.findOne(query);
      res.send(result);
    });
    // update package
    app.put("/package/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatePackage = req.body;
      const newPackage = {
        $set: {
          title: updatePackage.title,
          banner: updatePackage.banner,
          location: updatePackage.location,
          duration: updatePackage.duration,
          tourType: updatePackage.tourType,
          groupSize: updatePackage.groupSize,
          tourGuide: updatePackage.tourGuide,
          packagePricePerPerson: updatePackage.packagePricePerPerson,
          destination: updatePackage.destination,
          departure: updatePackage.departure,
          departureTime: updatePackage.departureTime,
          returnTime: updatePackage.returnTime,
          packageDetails: updatePackage.packageDetails,
          included: updatePackage.included,
          excluded: updatePackage.excluded,
          tourGallery: updatePackage.tourGallery,
          category: updatePackage.category,
        },
      };
      const result = await packagesCollection.updateOne(
        filter,
        newPackage,
        options
      );
      res.send(result);
    });

    // delete a package
    app.delete("/package/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await packagesCollection.deleteOne(query);
      res.send(result);
    });

    // destination apis
    // view all destionations
    app.get("/destionations", async (req, res) => {
      const result = await destinationsCollection.find().toArray();
      res.send(result);
    });
    // add a destination
    app.post("/destinations", async (req, res) => {
      const newdestinations = req.body;
      const result = await destinationsCollection.insertOne(newdestinations);
      res.send(result);
    });
    // view single destination
    app.get("/destination/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await destinationsCollection.findOne(query);
      res.send(result);
    });

    // delete a destination
    app.delete("/destination/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await destinationsCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//mongodb end

// basic setup
app.get("/", (req, res) => {
  res.send("Travlerz Server is Running.");
});

app.listen(port, () => {
  console.log(`Travlerz Server is Running on port: ${port}`);
});
