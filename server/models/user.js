const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// limits the returned user Object to only two public fields, id and email
UserSchema.methods.toJSON = function () { 
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, 'abc123').toString();

  //user.tokens.push({access, token});
  // OR
  user.tokens = user.tokens.concat([{access, token}]);

  // allows for chaining promises and accessing the token object in server.js
  return user.save().then(() => {
    return token; // gets passed as sucess value to next 'then' call
  }).catch((err) => console.log(err));
};

UserSchema.methods.removeToken = function (token) {
  let user = this;

  // finds a document which has a tokens.token propery equal to args token
  // and removes that tokens array enterily, so the 'tokens' key/propery will have 0 elements
  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

// (.methods) instance methods get called with the individual document
// (.statics) model methods get called with the overall Model
UserSchema.statics.findByToken = function (token) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch(err) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  let User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject('User not found.');
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (err) {
          return reject('Error in comparing passwords.');
        }

        if (!isValid) {
          return reject('Password is not valid.');
        }

        return resolve(user);
      });
    });
  })
};

// hash the password if the User was modified
UserSchema.pre('save', function (next) { 
  let user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

let User = mongoose.model('User', UserSchema);

module.exports = {
  User
}