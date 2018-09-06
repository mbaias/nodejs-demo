const mongoose = require('mongoose');
const Product = require('../models/product');

exports.allProducts = (req, res) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => ({
          _id: doc._id,
          name: doc.name,
          price: doc.price,
          productImage: doc.productImage,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${doc._id}`,
          },
        })),
      };
      res.status(200).json(response);
    })
    .catch(err =>
      res.status(404).json({
        error: err,
      })
    );
};

exports.createProduct = (req, res) => {
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Product was posted',
        createdProduct: {
          _id: result.id,
          name: result.name,
          price: result.price,
          productImage: result.productImage,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${result._id}`,
          },
        },
      });
    })
    .catch(error => {
      res.status(500).json({
        error,
      });
    });
};

exports.getProduct = (req, res) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('_id name price productImage')
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          _id: doc._id,
          name: doc.name,
          price: doc.price,
          productImage: doc.productImage,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products',
          },
        });
      } else {
        res.status(404).json({
          message: 'Entry does not exist in database',
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.updateProduct = (req, res) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.deleteProduct = (req, res) => {
  const id = req.params.productId;
  Product.findOneAndRemove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
};
