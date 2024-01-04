const jsonwebtoken = require("jsonwebtoken");
const { User } = require("../models/user");

const authenticateAdmin = async (req, res, next) => {
  if (typeof req?.cookies?.token === "undefined") {
    return res.status(401).send({
      message: "Token not found",
    });
  }
  const token = req.cookies.token;
  console.log(token);

  const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  console.log(decoded.id);
  const user = await User.findById(decoded.id);
  console.log(user);

  if (!user) {
    return res.status(404).send({
      message: "User not found",
    });
  }

  if (user.role !== "admin") {
    return res.status(401).send({
      message: "Admin resource. Access denied",
    });
  }

  next();
};

const authenticateUser = async (req, res, next) => {
  if (typeof req?.cookies?.token === "undefined") {
    return res.status(401).send({
      message: "Token not found",
    });
  }
  const token = req.cookies.token;
  console.log(token);
  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    console.log(decoded.id);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
  } catch (error) {
    return res.status(401).send({
      message: "Invalid token",
    });
  }

  next();
};

module.exports = { authenticateAdmin, authenticateUser };
