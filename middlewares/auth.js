const token = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/erorrs');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    return next(new UnauthorizedError('Необходима авторизация')); // next??, точно нужен return
  }

  let payload;

  try {
    payload = token.verify(jwt, 'some-secret-key');
  } catch (err) {
    return new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  return next();
};
