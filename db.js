const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/nodeJS_practise';
mongoose.connect(
  dbURI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  }
);

mongoose.connection.on('connected', () => console.log(`Mongoose connected to: ${dbURI}`));
mongoose.connection.on('error', err => console.log(`Mongoose connection error:${err}`));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

const gracefulShutdown = (msg, cb) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
    cb();
  });
};

process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});
