const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

exports.userSignUp = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(existingUser => {
      console.log(existingUser);
      if (existingUser) {
        return res.status(409).json({
          message: 'Mail already in use',
        });
      }
      return bcrypt.hash(req.body.password, 10, (error, hashedPassword) => {
        if (error) {
          return res.status(500).json({
            error,
          });
        }
        const user = new User({
          _id: mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hashedPassword,
        });
        return user
          .save()
          .then(createdUser => {
            res.status(201).json({
              message: 'User has been registered',
              user: createdUser,
            });
          })
          .catch(err => {
            res.status(500).json({
              err,
            });
          });
      });
    })
    .catch(error => {
      res.status(500).json({
        error,
      });
    });
};

exports.userSignIn = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      return bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed',
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            'secret',
            {
              expiresIn: '1h',
            }
          );
          return res.status(200).json({
            message: 'Auth successful',
            token,
          });
        }
        return res.status(401).json({
          message: 'Auth failed',
        });
      });
    })
    .catch(error => {
      res.status(401).json({
        message: 'Auth failed',
        error,
      });
    });
};
