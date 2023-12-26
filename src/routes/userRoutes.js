const express = require("express");

const { getAllUsers, createUser } = require("../controllers/userController");

const userRouter = express.Router();
userRouter.get("/", getAllUsers);
userRouter.post("/", createUser);

module.exports = userRouter;
