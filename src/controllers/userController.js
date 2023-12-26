const User = require("../models/user").User;
const express = require("express");

const userController = express.Router();

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
}

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
}

module.exports = {
  getAllUsers,
  createUser,
};