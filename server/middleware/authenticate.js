const {User} = require('./../models/user');

let authenticate = (req, res, next) => {
  const token = req.header('x-auth');

  User.findByToken(token).then((doc) => {
    if (!doc) {
      return Promise.reject(); // will go to catch()
    }

    req.user = doc;
    req.token = token;
    next();
  }).catch((err) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};