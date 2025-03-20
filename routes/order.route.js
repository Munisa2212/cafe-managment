// const { Order } = require("../models/index.module");
// const { Order_item_Validation } = require("../models/order_item.module");
// const { Product } = require("../models/product.module");

const express = require('express')
const router = express.Router()
const { Order, Order_item, Product, User } = require('../models/index.module')
const { Order_item_Validation } = require('../models/order_item.module')
const { roleMiddleware } = require('../middleware/role.middleware')

/**
 * @swagger
 * /order-product:
 *   post:
 *     summary: Mahsulotlar buyurtma qilish
 *     description: Foydalanuvchi tomonidan tanlangan mahsulotlarni buyurtma qilish.
 *     tags:
 *       - Order
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - count
 *             properties:
 *               product_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *               count:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [3, 2]
 *     responses:
 *       201:
 *         description: Buyurtma muvaffaqiyatli yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Buyurtma yaratildi"
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 5
 *                     price:
 *                       type: integer
 *                       example: 25000
 *       400:
 *         description: Notog'ri so'rov ma'lumotlari yoki balans yetarli emas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Balansingiz yetarli emas"
 *       404:
 *         description: Ba'zi mahsulotlar topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Ba'zi mahsulotlar topilmadi"
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server xatosi yuz berdi"
 */

/**
 * @swagger
 * /order-product:
 *   post:
 *     summary: Mahsulotlarni buyurtma qilish
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *               count:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Buyurtma muvaffaqiyatli yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Order"
 *       400:
 *         description: Noto‘g‘ri so‘rov
 *       500:
 *         description: Server xatosi
 */

router.post('/order-product', roleMiddleware, async (req, res) => {
  try {
    let { error } = Order_item_Validation.validate(req.body)
    if (error) return res.status(400).send({ error: error.details[0].message })

    const user_id = req.user.id
    const { product_id, count } = req.body

    if (
      !Array.isArray(product_id) ||
      !Array.isArray(count) ||
      product_id.length !== count.length
    ) {
      return res
        .status(400)
        .json({ error: 'product_id va count massivlari teng bo‘lishi kerak' })
    }

    const products = await Product.findAll({ where: { id: product_id } })
    if (products.length !== product_id.length) {
      return res.status(404).json({ error: "Ba'zi mahsulotlar topilmadi" })
    }

    let totalPrice = 0
    const Order_itemsData = []

    products.forEach((product, i) => {
      if (product.count < count[i]) {
        throw new Error(`Mahsulot yetarli emas: ${product.name}`)
      }
      const itemPrice = product.price * count[i]
      totalPrice += itemPrice

      Order_itemsData.push({
        product_id: product.id,
        count: count[i],
        price: itemPrice,
      })
    })

    const user = await User.findByPk(user_id)
    if (user.money < totalPrice) {
      return res.status(400).json({ error: 'Balansingiz yetarli emas' })
    }

    const order = await Order.create({ user_id, price: totalPrice })

    await Promise.all(
      Order_itemsData.map((item) =>
        Order_item.create({ order_id: order.id, ...item }),
      ),
    )

    await user.update({ money: user.money - totalPrice })

    await Promise.all(
      products.map((product, i) =>
        product.update({ count: product.count - count[i] }),
      ),
    )

    res.status(201).json({ message: 'Buyurtma yaratildi', order })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
