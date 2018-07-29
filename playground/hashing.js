const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '123abc';

// salts and hashes the password
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

// one of the generated hashes
let hashedPassword = '$2a$10$alhoh72SwpJFmdlm//UgWOp3LSHNGPk5MevnBIvKQY2/6HmGpr03K';


// prints 'true' or 'false' 
bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});