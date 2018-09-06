const mongoose = require('mongoose');
const Product = require('../models/product');
const Order = require('../models/order');

exports.allOrders = (req, res) => {
  Order.find()
    .select('_id product quantity')
    .populate('product', 'name price')
    .exec()
    .then(orders => {
      res.status(200).json({
        count: orders.length,
        orders: orders.map(order => ({
          _id: order._id,
          product: order.product,
          quantity: order.quantity,
          request: {
            type: 'GET',
            url: `http://localhost:3000/orders/${order._id}`,
          },
        })),
      });
    })
    .catch(error => {
      res.status(500).json({
        error,
      });
    });
};

exports.createOrder = (req, res) => {
  Product.findById(req.body.product)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.product,
        quantity: req.body.quantity,
      });
      return order.save();
    })
    .then(result => {
      res.status(201).json({
        _id: result.id,
        product: result.product,
        quantity: result.quantity,
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders/${result._id}`,
        },
      });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

exports.getOrder = (req, res) => {
  Order.findById(req.params.orderId)
    .populate('product', 'name price')
    .exec()
    .then(order => {
      if (!order) {
        res.status(404).json({
          message: 'Order not found',
        });
      }
      res.status(200).json({
        order,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders',
        },
      });
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.deleteOrder = (req, res) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};
