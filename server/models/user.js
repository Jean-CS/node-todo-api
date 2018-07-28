const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

let User = mongoose.model('User', UserSchema);

module.exports = {
  User
}