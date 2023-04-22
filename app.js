const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const getUsers = require('./routes/users');
const getUserById = require('./routes/users');
const createUser = require('./routes/users');
const getCards = require('./routes/cards');
const createCard = require('./routes/cards');
const deleteCardById = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6443b4aa1bf87bb0b16960b6',
  };

  next();
});

module.exports.createCard = (req, res) => {
  console.log(req.user._id);
};

app.use('/', getUsers);
app.use('/', getUserById);
app.use('/', createUser);

app.use('/', getCards);
app.use('/', createCard);
app.use('/', deleteCardById);

app.listen(PORT);
