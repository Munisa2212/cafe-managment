const { DataTypes } = require("sequelize")
const {db} = require("../config/db")
const joi = require("joi")

const Payment = db.define(
    "Payments",
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
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }
)

const PaymentValidation = joi.object({
    order_id: joi.number().required(),
    status: joi.boolean()
})

module.exports = {Payment, PaymentValidation}