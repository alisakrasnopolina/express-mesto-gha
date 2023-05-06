const mongoose = require('mongoose');
const Card = require('../models/card');

const STATUS_CREATED = 201;
const { DocumentNotFoundError } = mongoose.Error;
const ForbiddenError = require('../errors/forbidden_error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: ownerId })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new DocumentNotFoundError();
      }
      if (req.user._id === card.owner._id.toString()) {
        Card.deleteOne()
          .orFail()
          .populate(['owner', 'likes'])
          .then(res.send({ data: card }))
          .catch(next);
      } else {
        next(new ForbiddenError('Доступ запрещён.'));
      }
    })
    .catch(next);
};

function likes(req, res, next, method) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    method,
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.send({ data: card }))
    .catch(next);
}

module.exports.likeCard = (req, res, next) => {
  likes(req, res, next, { $addToSet: { likes: req.user._id } });
};

module.exports.dislikeCard = (req, res, next) => {
  likes(req, res, next, { $pull: { likes: req.user._id } });
};
