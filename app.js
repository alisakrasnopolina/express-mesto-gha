const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { handleErrors } = require('./errors/erorrs');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { DocumentNotFoundError } = mongoose.Error;
const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use('*', (req, res, next) => {
  next(new DocumentNotFoundError());
});

app.use((err, req, res, next) => {
  handleErrors(err, res);
  next();
});

app.listen(PORT);
