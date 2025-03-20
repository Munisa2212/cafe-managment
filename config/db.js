const {Sequelize} = require("sequelize")
require("dotenv").config()
console.log(process.env.PASSWORD)
console.log(process.env.DB_USER)
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false
})

async function connectDb() {
    try {
        await db.authenticate()
        console.log("connected to db")
        await db.sync({force: true})
    } catch (error) {
        console.log(error)
    }
}

module.exports = {db, connectDb}