const express = require("express");

const {
  getAllUsers,
  createUser,
  deleteUser,
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
userRouter.delete("/:id", authenticateAdmin, deleteUser);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/data", authenticateUser, getUserData);

module.exports = userRouter;
