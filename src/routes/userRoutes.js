const express = require("express");

const { getAllUsers, createUser, login } = require("../controllers/userController");

const userRouter = express.Router();
userRouter.get("/", getAllUsers);
userRouter.post("/", createUser);
userRouter.post("/login", login);

module.exports = userRouter;
