const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1 style='font-family:sans-serif'>e-RISPKP Backend</h1>");
});

app.use("/users", require("./src/routes/userRoutes"));

//! No Route Found Error
app.use((req, res) => {
  res.status(404).send({
    message: "Route not found",
  });
});

try {
  const port = 5000;
  if (!process.env.MONGO_URI) {
    throw new Error("Database URI can't be found");
  }
  console.log(process.env.MONGO_URI);
  mongoose.connect(process.env.MONGO_URI);
  mongoose.connection.once("open", () => {
    console.log("Connected to database");
  });
  mongoose.connection.on(
    "error",
    console.error.bind(console, "connection error:")
  );
  app.listen(port, () => {
    console.log("Example app listening on port " + port);
  });
} catch (error) {
  console.error(error.message);
}
