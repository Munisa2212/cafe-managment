const router = require('express').Router();
const {Payment, PaymentValidation} = require('../models/payment.module');
// const QR = require('qrcode')

router.get('/', async (req, res) => {
    try {
        let {page = 1, limit = 10, sort = 'id', order = 'ASC', status} = req.query;

        let where = {};
        if (status) where.status = status;

        let payments = await Payment.findAndCountAll({
            where,
            order: [[sort, order.toUpperCase()]],
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit)
        });
        res.status(200).send({
            payments: payments.rows,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
