const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const corsConfig = {
  origin: "*",
  credentials: true,
  // methods: ["GET", "POST", "PUT", "DELETE"],
  optionSuccessStatus: 200,
};

//middlewares
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
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
    const bookingsCollection = client.db("travlerzDB").collection("bookings");
    const reviewsCollection = client.db("travlerzDB").collection("reviews");
    const tourGuideCollection = client
      .db("travlerzDB")
      .collection("tourGuides");

    // users Apis
    // view all users
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });
    // create a user to db collection
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

    app.put("/user/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const filter = { email: email };
        const updateUser = req.body;
        const newUser = {
          $set: {
            phone: updateUser.phone,
            gender: updateUser.gender,
            dob: updateUser.dob,
            country: updateUser.country,
          },
        };
        const result = await usersCollection.updateOne(filter, newUser);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
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
    app.get("/destinations", async (req, res) => {
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

    app.put("/destination/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDestination = req.body;
      const newDestination = {
        $set: {
          title: updateDestination.title,
          banner: updateDestination.banner,
          location: updateDestination.location,
          mapLink: updateDestination.mapLink,
          destinationDescription: updateDestination.destinationDescription,
          climateAndWeather: updateDestination.climateAndWeather,
          localCuisine: updateDestination.localCuisine,
          transportation: updateDestination.transportation,
          destinationGallery: updateDestination.destinationGallery,
          attractions: updateDestination.attractions,
          travelTips: updateDestination.travelTips,
          accommodation: updateDestination.accommodation,
        },
      };
      const result = await destinationsCollection.updateOne(
        filter,
        newDestination,
        options
      );
      res.send(result);
    });

    // delete a destination
    app.delete("/destination/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await destinationsCollection.deleteOne(query);
      res.send(result);
    });
    // view all bookings
    app.get("/bookings", async (req, res) => {
      const result = await bookingsCollection.find().toArray();
      res.send(result);
    });

    // add a booking
    app.post("/bookings", async (req, res) => {
      const newbookings = req.body;
      newbookings.status = "pending";
      const result = await bookingsCollection.insertOne(newbookings);
      res.send(result);
    });

    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingsCollection.findOne(query);
      res.send(result);
    });

    app.get("/bookings/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid };
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });

    app.patch("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateStatus = {
        $set: {
          status: status,
        },
      };
      const result = await bookingsCollection.updateOne(filter, updateStatus);
      res.send(result);
    });

    // delete a booking
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      res.send(result);
    });

    // reviews apis
    //view all reviews
    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });
    // add a review
    app.post("/reviews", async (req, res) => {
      const newReviews = req.body;
      const result = await reviewsCollection.insertOne(newReviews);
      res.send(result);
    });

    // view user specific reviews
    app.get("/reviews/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid };
      const result = await reviewsCollection.find(query).toArray();
      res.send(result);
    });

    // delete a review
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewsCollection.deleteOne(query);
      res.send(result);
    });
    // tour guides apis
    // view all guides
    app.get("/tour-guides", async (req, res) => {
      const result = await tourGuideCollection
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });

    // add a guide
    app.post("/tour-guides", async (req, res) => {
      const newGuides = req.body;
      newGuides.designation = "Tour Guide";
      const result = await tourGuideCollection.insertOne(newGuides);
      res.send(result);
    });

    // vew single guide
    app.get("/guide/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tourGuideCollection.findOne(query);
      res.send(result);
    });

    // update a guide
    app.patch("/guide/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const guide = req.body;
      const updateStatus = {
        $set: {
          name: guide.name,
          guideImage: guide.guideImage,
          facebookURL: guide.facebookURL,
          instagramURL: guide.instagramURL,
          twitterURL: guide.twitterURL,
          whatsappURL: guide.whatsappURL,
        },
      };
      const result = await tourGuideCollection.updateOne(filter, updateStatus);
      res.send(result);
    });
    // delete a guide
    app.delete("/tour-guides/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tourGuideCollection.deleteOne(query);
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
