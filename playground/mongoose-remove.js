const {ObjectID} = require('mongodb'); 

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

// no parameters -> removes all
// does not return objects removed
Todo.remove({}).then((result) => {
  console.log(result);
});

// returns object removed
Todo.findOneAndRemove({_id: 'qweqweqeqeqeqweq'}).then((todo) => {
  console.log(todo);
});

// returns object removed
Todo.findByIdAndRemove('asdqweqweqweqwe').then((todo) => {
  console.log(todo);
});