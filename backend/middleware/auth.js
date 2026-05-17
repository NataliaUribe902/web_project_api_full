const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log("🔐 AUTH HEADER:", authorization);

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({
      message: "Autorización requerida",
    });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    return res.status(401).send({
      message: "Autorización requerida",
    });
  }

  req.user = payload;

  return next();
};
