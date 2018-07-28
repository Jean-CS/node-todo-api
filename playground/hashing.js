const {SHA256} = require('crypto-js');

let message = 'I am a user number 4';
let hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

let data = {
  id: 4
};

let token = {
  data,
  hash: SHA256(JSON.stringify(data) + "secretSalt").toString()
};

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(data) + "secretSalt").toString();
// // will print 'Data was changed.' 

let resultHash = SHA256(JSON.stringify(token.data) + "secretSalt").toString();
if (resultHash === token.hash) {
  console.log('Data was not changed');
} else {
  console.log('Data was changed. Do not trust!');
}