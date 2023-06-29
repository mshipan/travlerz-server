const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());

// basic setup
app.get("/", (req, res) => {
  res.send("Travlerz Server is Running.");
});

app.listen(port, () => {
  console.log(`Travlerz Server is Running on port: ${port}`);
});
