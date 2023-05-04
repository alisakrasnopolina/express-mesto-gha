const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const STATUS_CREATED = 201;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  // const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(req.body.password, 10)

    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(STATUS_CREATED).send({ data: user }))
    .catch(next);
};

// module.exports.updateProfile = (req, res, next) => {
//   const { name, about } = req.body;

//   User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
//     .orFail()
//     .then((user) => res.send({ data: user }))
//     .catch(next);
// };

// module.exports.updateAvatar = (req, res, next) => {
//   const { avatar } = req.body;

//   User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
//     .orFail()
//     .then((user) => res.send({ data: user }))
//     .catch(next);
// };

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
        .send({ token, email });
    })
    .catch(next);
};
