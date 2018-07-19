// const MongoClient = require('mongodb').MongoClient;
const {MongoClient} = require('mongodb'); // object destructuring

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server.');
  }

  console.log('Connected to MongoDB server.');
  const db = client.db('TodoApp')

  // fetch todo with _id
  db.collection('Todos').find({_id: '57bb12335d123bo43414'}).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch todos', err);
  });
});