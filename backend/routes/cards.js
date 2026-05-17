const routerCards = require("express").Router();

const {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

routerCards.get("/", getCards);
routerCards.post("/", createCard);
routerCards.delete("/:cardId", deleteCard);
routerCards.put("/:cardId/likes", likeCard);
routerCards.delete("/:cardId/likes", dislikeCard);

module.exports = routerCards;
