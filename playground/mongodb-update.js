const {MongoClient, ObjectID} = require('mongodb'); // object destructuring

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server.');
  }

  console.log('Connected to MongoDB server.');
  const db = client.db('TodoApp');

  db.collection('Todos').findOneAndUpdate({
    name: 'Eat lunch'
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false // default is true. returns original document
  }).then((result) => {
    console.log(result);
  });

  db.collection('Users').findOneAndUpdate({
    name: 'John'
  }, {
    $set: {
      name: 'Rick'
    },
    $inc: {
      age: 3 // increment age by 3
    }
  }, {
    returnOriginal: false // default is true. returns original document
  }).then((result) => {
    console.log(result);
  });

});