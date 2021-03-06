let mongoose = require('mongoose');

mongoose.Promise = global.Promise; // use the javascript built-in Promises

mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  mongoose
};