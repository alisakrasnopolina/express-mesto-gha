const router = require('express').Router();
const Card = require('../models/card');

router.get('/cards', (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
});

router.post('/cards', (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
});

router.delete('/cards/:cardId', (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
});

router.put('/cards/:cardId/likes', (req, res) => {
  Card.findByIdAndUpdate(req.user._id)
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
});

router.delete('/cards/:cardId/likes', (req, res) => {
  Card.findByIdAndRemove(req.user._id)
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
});

module.exports = router;
