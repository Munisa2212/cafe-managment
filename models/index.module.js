const { Category } = require('./category.module')
const { Order } = require('./order.module')
const { User } = require('./user.module')
const { Payment } = require('./payment.module')
const { Product } = require('./product.module')
const { OrderItem } = require('./order_item.module')

Category.hasMany(Product, { foreignKey: 'category_id' })
Product.belongsTo(Category, { foreignKey: 'category_id' })

User.hasMany(Order, { foreignKey: 'user_id' })
Order.belongsTo(User, { foreignKey: 'user_id' })

Order.hasMany(OrderItem, { foreignKey: 'order_id' })
OrderItem.belongsTo(Order, { foreignKey: 'order_id' })

Product.hasMany(OrderItem, { foreignKey: 'product_id' })
OrderItem.belongsTo(Product, { foreignKey: 'product_id' })

Order.hasOne(Payment, { foreignKey: 'order_id' })
Payment.belongsTo(Order, { foreignKey: 'order_id' })

module.exports = { Category, Product, User, Order, OrderItem, Payment }
