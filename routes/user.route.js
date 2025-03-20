const { User } = require("../models/index.module");
const { UserValidation } = require("../models/user.module");
const express = require("express");
const bcrypt = require("bcrypt");
const route = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             name: "John Doe"
 *             email: "johndoe@example.com"
 *             role: "customer"
 *             password: "securepassword"
 *             money: 100
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: "John Doe"
 *               email: "johndoe@example.com"
 *               role: "customer"
 *               money: 100
 *       400:
 *         description: Validation error or email already exists
 *         content:
 *           application/json:
 *             example:
 *               error: "Email already exists"
 *
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             email: "johndoe@example.com"
 *             password: "securepassword"
 *     responses:
 *       200:
 *         description: Successful login, returns JWT token
 *         content:
 *           application/json:
 *             example:
 *               token: "your.jwt.token"
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid email or password"
 *
 * /user/add-balance/{id}:
 *   post:
 *     summary: Add balance to a user account
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               money:
 *                 type: number
 *           example:
 *             money: 50
 *     responses:
 *       200:
 *         description: Balance updated successfully
 *         content:
 *           application/json:
 *             example:
 *               money: 150
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: "User not found"
 */

route.post("/register", async (req, res) => {
  try {
    const { error } = UserValidation.validate(req.body); 
    if (error) return res.status(400).json({ error: error.message });

    const { name, email, role, password, money } = req.body;

    let one = await User.findOne({ where: { email: email } });
    if (one) return res.status(400).json({ error: "Email already exists" });

    let hash = bcrypt.hashSync(password, 10);
    let user = await User.create({ name, email, role, password: hash, money });

    res.status(201).json({ user });
  } catch (err) {
    console.log(err.message); // ✅ Xatolikni aniqroq chiqarish
    res.status(500).json({ error: err.message || "Server error" });
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
    console.log(err.message);
    res.status(500).json({ error: err.message || "Server error" });
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
    console.log(err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

module.exports = route;