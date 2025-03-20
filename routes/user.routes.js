const { User } = require("../models/index.module");
const { UserValidation } = require("../models/user.module");
const express = require("express");
const bcrypt = require("bcrypt");
const route = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");

route.post("/register", async (req, res) => {
  try {
    const { error } = UserValidation(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { name, email, role, password, money } = req.body;

    let one = await User.findOne({ where: { email: email } });
    if (one) return res.status(400).json({ error: "Email already exists" });

    let hash = bcrypt.hashSync(password, 10);
    let user = await User.create({ name, email, role, password: hash, money });

    res.status(201).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(400).json({ error: "User not found" });

    let valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid password" });

    let token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET);
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

route.post("/add-balance/:id", async (req, res) => {
  try {
    let user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    let { money } = req.body;
    let updatedMoney = user.money + money;
    await user.update({ money: updatedMoney });

    res.json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = route;
