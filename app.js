const express = require('express');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const STATUS_NOT_FOUND = 404;
const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

const owner = (req, res, next) => {
  req.user = {
    _id: '6443b4aa1bf87bb0b16960b6',
  };

  next();
};

app.use(owner);

app.use('/', routerUsers);

app.use('/', routerCards);

app.use('*', (req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Данные не найдены!' });
});

app.listen(PORT);
