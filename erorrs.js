const mongoose = require('mongoose');

const STATUS_BAD_REQUEST = 400;
const STATUS_NOT_FOUND = 404; // ERROR_NOT_FOUND
const STATUS_INTERNAL_SERVER_ERROR = 500;
const { CastError, ValidationError } = mongoose.Error;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

const handleErrors = (err, res) => {
  if (err instanceof NotFoundError) {
    return res.status(STATUS_NOT_FOUND).send({ message: 'Данные не найдены!' });
  }
  if (err instanceof CastError || err instanceof ValidationError) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'Некорректные данные!' });
  }
  return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка!' });
};

module.exports = { handleErrors };
