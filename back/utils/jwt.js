const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "secretkey";

const createToken = (payload) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: "2h" });
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};
const destroyToken = (token) => {
  // return jwt.(token, jwtSecret);
  return true;
  // return jwt.(token, jwtSecret);
};

module.exports = { createToken, verifyToken, destroyToken };
