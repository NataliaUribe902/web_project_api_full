const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Id inválido" });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.addUser = (req, res) => {
  console.log("📦 BODY LLEGANDO:", req.body);
  const { name, about, avatar, email, password } = req.body;
  console.log("BODY:", req.body);

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      });
    })
    .then((user) => {
      res.send({
        data: {
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      console.log("🔥 ERROR COMPLETO ADDUSER:", err);

      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: err.message,
        });
      }

      if (err.code === 11000) {
        return res.status(409).send({
          message: "El correo ya está en uso",
        });
      }

      return res.status(500).send({
        message: err.message,
      });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Id inválido" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Id inválido" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }
      res.status(500).send({ message: err.message });
    });
};
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Correo o contraseña incorrectos"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Correo o contraseña incorrectos"));
        }

        const token = jwt.sign({ _id: user._id }, "some-secret-key", {
          expiresIn: "7d",
        });

        return res.send({ token });
      });
    })
    .catch((err) => {
      return res.status(401).send({
        message: err.message,
      });
    });
};
module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "Usuario no encontrado",
        });
      }

      return res.send(user);
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message,
      });
    });
};
