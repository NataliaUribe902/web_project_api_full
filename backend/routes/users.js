const routerUsers = require("express").Router();

const {
  getUsers,
  getUser,
  updateAvatar,
  updateUser,
  getCurrentUser,
} = require("../controllers/users");

routerUsers.get("/", getUsers);

routerUsers.get("/me", getCurrentUser);

routerUsers.patch("/me", updateUser);

routerUsers.patch("/me/avatar", updateAvatar);

routerUsers.get("/:id", getUser);

module.exports = routerUsers;
