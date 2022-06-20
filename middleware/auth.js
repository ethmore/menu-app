const jwt = require("jsonwebtoken");

const config = process.env;
const path = require('path');

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies["token"];

  if (!token) {
    // return res.status(403).send("A token is required for authentication");
    return res.status(403).sendFile(path.join(__dirname + '/../public/admin/user/login/login.html'));
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    // return res.status(401).send("Invalid Token");
    return res.status(403).sendFile(path.join(__dirname + '/../public/admin/user/login/login.html'));

  }
  return next();
};

module.exports = verifyToken;