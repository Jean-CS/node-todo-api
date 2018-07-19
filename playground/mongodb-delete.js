const {MongoClient, ObjectID} = require('mongodb'); // object destructuring

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server.');
  }

  console.log('Connected to MongoDB server.');
  const db = client.db('TodoApp');

  // deleteMany
  db.collection('Todos').deleteMany({text: 'Whatever'}).then((result) => {
    console.log(result);
  });

  // deleteOne
  db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    console.log(result);
  });

  // findOneAndDelete
  db.collection('Todos').findOneAndDelete({
    _id: new ObjectID("23ee686mn545o0h4503")
  }).then((result) => {
    console.log(JSON.stringify(result, undefined, 2)); // prints the found document
  });

});