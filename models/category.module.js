const {db} = require("../config/db")
const {DataTypes} = require("sequelize")
const joi = require("joi")

const Category = db.define("category", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

const CategoryValidation = joi.object({
    name: joi.string().required()
})

module.exports = {Category, CategoryValidation}