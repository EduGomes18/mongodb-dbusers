const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authConfig = require("../../config/auth");

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

router.post("/register", async (req, res) => {
  const { email } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(400).send({ error: "User already registered" });

    const user = await User.create(req.body);

    user.password = undefined;

    const token = generateToken({ id: user.id });

    return res.send({ user, token });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "Registration failed " });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) return res.status(400).send({ error: "User not found" });

  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).send({ error: "Invalid password" });

  user.password = undefined;

  const token = generateToken({ id: user.id });

  res.send({ user, token });
});

module.exports = (app) => app.use("/auth", router);
