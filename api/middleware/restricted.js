const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../jwtSecret");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === undefined) {
    next({ status: 401, message: "Token required" });
  }
  jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      next({ status: 401, message: "Token invalid" });
    } else {
      req.decodedToken = decodedToken;
      next();
    }
  });
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
