const Card = require("../models/card");
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Error del servidor" });
    });
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
};
module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return res.status(403).send({
          message: "No tienes permiso para borrar esta tarjeta",
        });
      }

      return Card.findByIdAndDelete(card._id);
    })
    .then((deletedCard) => res.send(deletedCard))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({
          message: "Tarjeta no encontrada",
        });
      }

      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Id inválido",
        });
      }

      return res.status(500).send({
        message: err.message,
      });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Tarjeta no encontrada" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Id inválido" });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Tarjeta no encontrada" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Id inválido" });
      }
      res.status(500).send({ message: err.message });
    });
};
