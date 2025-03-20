const { DataTypes } = require("sequelize")
const {db} = require("../config/db")
const joi = require("joi")

const Order_item = db.define(
    "Order_items",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        count: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }
)

const Order_item_Validation = joi.object({
    order_id: joi.number(),
    product_id: joi.number(),
    count: joi.number().required(),
    price: joi.number()
})

module.exports = {Order_item, Order_item_Validation}