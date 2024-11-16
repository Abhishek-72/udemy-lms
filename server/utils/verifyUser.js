const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({
        status: false,
        message: "Token is not correct",
      });
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
