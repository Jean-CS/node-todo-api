const express = require('express');
const bodyParser = require('body-parser'); // takes the JSON and converts to object
const {ObjectID} = require('mongodb');


const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();

const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = {
  app
};