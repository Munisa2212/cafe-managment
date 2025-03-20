const { Order } = require("../models/oder.module");
const { Order_item_Validation } = require("../models/order_item.module");
const { Product } = require("../models/product.module");

const app = require("express").Router()

app.post("/order-product", async(req, res)=>{
    const user_id = req.user.id
    const {product_id, count} = req.body
    try {
        let { error } = Order_item_Validation.validate(req.body);
        if (error) return res.status(400).send({ error: error.details[0].message }); 
        
        for (const element of product_id){
            const product = await Product.findOne({where: {id: element}})
        }
    } catch (error) {
        res.send(error)
    }
})






module.exports = app