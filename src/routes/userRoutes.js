const express = require("express");

const {
  getAllUsers,
  createUser,
  login,
  getUserData,
  logout,
} = require("../controllers/userController");
const {
  authenticateAdmin,
  authenticateUser,
} = require("../middlewares/authentication");

const userRouter = express.Router();
userRouter.get("/", authenticateAdmin, getAllUsers);
userRouter.post("/", createUser);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/data", authenticateUser, getUserData);

module.exports = userRouter;
