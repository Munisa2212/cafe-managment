const { db } = require('../config/db')
const { DataTypes } = require('sequelize')
const joi = require('joi')

const User = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('costumer', 'user', 'staff'),
    defaultValue: 'user',
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  money: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
})

const UserValidation = joi.object({
  name: joi.string().min(3).max(50).required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  role: joi.string(),
  money: joi.number().min(0),
})

module.exports = { User, UserValidation }
