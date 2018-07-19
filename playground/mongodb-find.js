// const MongoClient = require('mongodb').MongoClient;
const {MongoClient} = require('mongodb'); // object destructuring

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server.');
  }

  console.log('Connected to MongoDB server.');
  const db = client.db('TodoApp')

  // fetch todo with _id
  db.collection('Todos').find().count().then((count) => {
    console.log('Todos count:', count);
  }, (err) => {
    console.log('Unable to fetch todos', err);
  });
});