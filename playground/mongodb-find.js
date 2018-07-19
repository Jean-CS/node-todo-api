// const MongoClient = require('mongodb').MongoClient;
const {MongoClient} = require('mongodb'); // object destructuring

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server.');
  }

  console.log('Connected to MongoDB server.');
  const db = client.db('TodoApp')

  // fetch all todos that have not been completed yet
  db.collection('Todos').find({completed: false}).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch todos', err);
  });
});