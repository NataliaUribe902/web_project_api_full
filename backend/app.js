const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const routerUsers = require("./routes/users");
const routerCards = require("./routes/cards");

const { login, addUser } = require("./controllers/users");
const auth = require("./middleware/auth");

const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://localhost:27017/aroundb");

app.use(cors());
app.use(express.json());

app.post("/signin", login);
app.post("/signup", addUser);

app.use(auth);

app.use("/users", routerUsers);
app.use("/cards", routerCards);

app.use((req, res) => {
  res.status(404).json({
    message: "Recurso solicitado no encontrado",
  });
});

app.listen(PORT, () => {
  console.log(`app running in the port ${PORT}`);
});
