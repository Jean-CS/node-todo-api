let mongoose = require('mongoose');

mongoose.Promise = global.Promise; // use the javascript built-in Promises
mongoose.connect('mongodb://localhost:27017/TodoApp');

let Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
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