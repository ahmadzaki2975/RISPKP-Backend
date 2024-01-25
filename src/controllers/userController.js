const User = require("../models/user").User;
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const CustomError = require("../errors/CustomError");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const filteredUsers = users.map((user) => {
      return {
        username: user.username,
        role: user.role,
        _id: user._id,
      };
    });
    res.send(filteredUsers);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
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
    if (error instanceof CustomError) {
      return res.status(error.status).send(error.toResponse());
    }
    if(error.code === 11000) {
      return res.status(409).send(`User dengan username ${username} sudah terdaftar`);
    }
    res.status(500).send({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    res.send(user);
  } catch (error) {
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

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new CustomError("Wrong password", 401);
    }

    const token = jsonwebtoken.sign(
      {
        username: user.username,
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res
      .cookie("token", token, {
        maxAge: 8 * 60 * 60 * 1000,
        // domain: process.env.NODE_ENV === "dev" ? undefined : ".vercel.app",
        secure: process.env.NODE_ENV === "dev" ? false : true,
        sameSite: process.env.NODE_ENV === "dev" ? "lax" : "none",
        // httpOnly: process.env.NODE_ENV === "dev" ? false : true,
      })
      .status(200)
      .send({
        message: "Login successful",
        domain: process.env.NODE_ENV === "dev" ? undefined : ".vercel.app",
      });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.status).send(error.toResponse());
    }
    res.status(500).send({
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  res.cookie("token", "", {
    maxAge: 0,
    secure: process.env.NODE_ENV === "dev" ? false : true,
    sameSite: process.env.NODE_ENV === "dev" ? "lax" : "none",
  });
  res.send({
    message: "Logout successful",
  });
};

const getUserData = async (req, res) => {
  const token = req.cookies.token;

  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    res.send({
      username: user.username,
      role: user.role,
    });
  } catch (error) {
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
  deleteUser,
  login,
  logout, 
  getUserData,
};
