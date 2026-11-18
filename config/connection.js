const { connect, connection } = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialNetworkDB';

connect(uri).catch((err) => {
  console.error('MongoDB connection failed:', err.message);
});

module.exports = connection;
