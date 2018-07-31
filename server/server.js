require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser'); // takes the JSON and converts to object
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');


const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();

const port = process.env.PORT;

app.use(bodyParser.json()); // parses every json request into an object

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos
    }); // sending an object is more flexible than sending an array with -> Sres.send(docs)
  }, (err) => {
    res.status(400).send(err);
  });
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    return res.send({todo});
  }).catch(() => res.status(400).send());
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    return res.send({todo});
  }).catch((() => res.status(400).send()));
});

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  // get only the Todo fields that the user can edit 
  const body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {
    $set: body // updates the object
  }, {
    new: true // returns the updated object from the db
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    return res.send({todo});
  }).catch((err) => res.status(400).send());
});

app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  let user = new User(body);

  user.save().then((doc) => {
    return doc.generateAuthToken();
  }).then((token) => {
    // x- ... means its a custom header
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send({user});
    });
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = {
  app
};