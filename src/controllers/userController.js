const User = require("../models/user").User;
const express = require("express");

const userController = express.Router();
const CustomError = require("../errors/CustomError");

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
    const { username, password } = req.body;
    if (!username || !password) {
      throw new CustomError("Username and password are required", 400);
    }
    const user = new User({
      username,
      password,
    });
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error.message);
    if(error instanceof CustomError) {
      return res.status(error.status).send(error.toResponse());
    }
    res.status(500).send({
      message: error.message,
    });
  }
}

module.exports = {
  getAllUsers,
  createUser,
};