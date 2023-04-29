const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtgen(usernmae) {
  const payload = {
    user: usernmae,
  };
  return jwt.sign(payload, process.env.jwt, { expiresIn: "1hr" });
}
module.exports = jwtgen;
