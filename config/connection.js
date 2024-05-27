const { connect, connection } = require('mongoose');

// Change the database name to something more relevant
connect('mongodb://127.0.0.1:27017/socialNetworkDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;