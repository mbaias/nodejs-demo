const express = require('express');
const morgan = require('morgan');
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
require('./db');

const app = express();

app.use('/uploads', express.static('uploads'));
app.use(morgan('dev'));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
