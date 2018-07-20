let mongoose = require('mongoose');

mongoose.Promise = global.Promise; // use the javascript built-in Promises
mongoose.connect('mongodb://localhost:27017/TodoApp');

let Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

let User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

let newTodo = new Todo({
  text: 'Make lunch'
});

newTodo.save().then((doc) => {
  console.log('Saved todo', doc);
}, (err) => {
  console.log('Unable to save todo.');
})

let newUser = new User({
  email: 'mongoose@user.com'
});

newUser.save().then((doc) => {
  console.log('Saved user', doc);
}, (err) => {
  console.log('Unable to save user.');
})