const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const dummyUsers = [{
  _id: userOneId,
  email: 'something@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'example@somethingelse.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
  }]
}];

const dummyTodos = [{
  _id: new ObjectID(),
  text: 'First test dummy todo',
  _creator: userOneId
}, {
  _id: new ObjectID(),
  text: 'Second test dummy todo',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}];

// clear the database before each test
const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(dummyTodos); // return allows for chaining promises, as below
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(dummyUsers[0]).save();
    let userTwo = new User(dummyUsers[1]).save();

    // waits for all promises in the array to complete.
    // in this case 'userOne' and 'userTwo'
    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {
  dummyTodos, 
  dummyUsers,
  populateTodos,
  populateUsers
};