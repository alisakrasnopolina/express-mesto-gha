const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const STATUS_CREATED = 201;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

function getUserWithId(req, res, next, id) {
  User.findById(id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch(next);
}

module.exports.getUserById = (req, res, next) => {
  getUserWithId(req, res, next, req.params.userId);
};

module.exports.getUser = (req, res, next) => {
  getUserWithId(req, res, next, req.user._id);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  bcrypt.hash(req.body.password, 10)

    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.status(STATUS_CREATED).send({ data: user }))
    .catch(next);
};

function update(req, res, next, { name, about, avatar }) {
  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch(next);
}

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  update(req, res, next, { name, about });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  update(req, res, next, { avatar });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ email });
    })
    .catch(next);
};
