const { Category } = require('./category.module')
const { Order } = require('./oder.module')
const { User } = require('./user.module')
const { Payment } = require('./payment.module')
const { Product } = require('./product.module')
const { Order_item } = require('./order_item.module')

Category.hasMany(Product, { foreignKey: 'category_id' })
Product.belongsTo(Category, { foreignKey: 'category_id' })

User.hasMany(Order, { foreignKey: 'user_id' })
Order.belongsTo(User, { foreignKey: 'user_id' })

Order.hasMany(Order_item, { foreignKey: 'order_id' })
Order_item.belongsTo(Order, { foreignKey: 'order_id' })

Product.hasMany(Order_item, { foreignKey: 'product_id' })
Order_item.belongsTo(Product, { foreignKey: 'product_id' })

Order.hasOne(Payment, { foreignKey: 'order_id' })
Payment.belongsTo(Order, { foreignKey: 'order_id' })

module.exports = { Category, Product, User, Order, Order_item, Payment }
