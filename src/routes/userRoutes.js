const express = require("express");

const { getAllUsers, createUser, login } = require("../controllers/userController");
const authenticateAdmin = require("../middlewares/authentication");

const userRouter = express.Router();
userRouter.get("/", authenticateAdmin, getAllUsers);
userRouter.post("/", createUser);
userRouter.post("/login", login);

module.exports = userRouter;
