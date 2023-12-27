const User = require("../models/user").User;
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
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
};

const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new CustomError("Username and password are required", 400);
    }
    const salt = await bcrypt.genSalt(10);
    const user = new User({
      username,
      password: await bcrypt.hash(password, salt),
      salt,
    });
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error.message);
    if (error instanceof CustomError) {
      return res.status(error.status).send(error.toResponse());
    }
    res.status(500).send({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      throw new CustomError("Username and password are required", 400);
    }

    const user = await User.findOne({ username });
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const combinedPassword = user.password + user.salt;
    await bcrypt.compare(combinedPassword, password, (err) => {
      if (err) {
        throw new CustomError("Wrong password", 400);
      }
    });

    const token = jsonwebtoken.sign(
      {
        username: user.username,
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res
      .cookie("token", token, { maxAge: 8 * 3600000 })
      .cookie("set-date", new Date().toISOString())
      .status(200)
      .send({
        message: "Login successful",
      });
  } catch (error) {
    console.log(error.message);
    if (error instanceof CustomError) {
      return res.status(error.status).send(error.toResponse());
    }
    res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  login,
};
