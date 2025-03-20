const {db} = require("../config/db")
const {DataTypes} = require("sequelize")
const joi = require("joi")

const Product = db.define("Products", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

const ProductValidation = joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required(),
    category_id: joi.number().required(),
    image: joi.string().required(),
    status: joi.boolean().required(),
    count: joi.number().required()
})

module.exports = {Product, ProductValidation}