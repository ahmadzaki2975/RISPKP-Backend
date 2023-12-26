import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//! No Route Found Error
app.use((req, res, next) => {
  res.status(404).send({
    message: "Route not found",
  });
});

try {
  const port = 5000;
  if (!process.env.MONGO_URI) {
    throw new Error("Database URI can't be found");
  }
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
