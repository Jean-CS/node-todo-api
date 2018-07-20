let mongoose = require('mongoose');

mongoose.Promise = global.Promise; // use the javascript built-in Promises
mongoose.connect('mongodb://localhost:27017/TodoApp');

