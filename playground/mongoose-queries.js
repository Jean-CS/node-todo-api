const {ObjectID} = require('mongodb'); 

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

const id = "5b514deb84ce80743848b6b6";

if (!ObjectID.isValid(id)) {
  console.log('Object Id is not valid.');
}

// find all -- returns an array
Todo.find({
  _id: id // mongoose converts the string into ObjectID
}).then((todos) => console.log('Todos', todos));

// returns only one object
Todo.findOne({
  _id: id
}).then((todo) => console.log('Todo', todo));

Todo.findById(id).then((todo) => {
  if (!todo) {
    console.log('Id not found.');
  }
  console.log('Todo by id', todo)
}).catch((e) => console.log(e));