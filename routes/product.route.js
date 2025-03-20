const route = require("express").Router();
const { Product, ProductValidation } = require("../models/product.module");
const { Op } = require("sequelize");

route.get("/", async (req, res) => {
  try {
    let {page = 1, limit = 10, sort = "id", order = "ASC", name, category_id, min_price, max_price} = req.query;

    let where = {};
    if (name) where.name = { [Op.like]: `${name}%` };
    if (category_id) where.category_id = category_id;
    if (min_price && max_price) {
      where.price = { [Op.between]: [min_price, max_price] };
    } else if (min_price) {
      where.price = { [Op.gte]: min_price };
    } else if (max_price) {
      where.price = { [Op.lte]: max_price };
    }

    let products = await Product.findAndCountAll({
      where,
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.status(200).send({
      products: products.rows,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

route.post("/", async (req, res) => {
  try {
    let { error } = ProductValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let newProduct = await Product.create(req.body);
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

route.get("/:id", async (req, res) => {
  try {
    let product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

route.put("/:id", async (req, res) => {
  try {
    let { error } = ProductValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    await product.update(req.body);
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

route.delete("/:id", async (req, res) => {
  try {
    let product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    await product.destroy();
    res.status(200).send("Product deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = route;