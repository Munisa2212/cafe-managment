const router = require('express').Router();
const { Category, CategoryValidation } = require('../models/category.module');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
    try {
        let { page = 1, limit = 10, sort = 'id', order = 'ASC', name } = req.query;

        let where = {};
        if (name) where.name = { [Op.like]: `${name}%` };

        let categories = await Category.findAndCountAll({
            where,
            order: [[sort, order.toUpperCase()]],
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit)
        });

        res.status(200).send({
            categories: categories.rows,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        let category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).send("Category not found");
        res.status(200).send(category);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post("/", async (req, res) => {
    try {
        let { error } = CategoryValidation.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let newCategory = await Category.create(req.body);
        res.status(201).send(newCategory);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        let category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).send("Category not found");

        await category.destroy();
        res.status(204).send("Category deleted successfully");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;