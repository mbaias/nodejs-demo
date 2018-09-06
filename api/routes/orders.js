const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const OrdersController = require('../controllers/orders');

const router = express.Router();

router.get('/', OrdersController.allOrders);

router.post('/', checkAuth, OrdersController.createOrder);

router.get('/:orderId', OrdersController.getOrder);

router.delete('/:orderId', checkAuth, OrdersController.deleteOrder);

module.exports = router;
