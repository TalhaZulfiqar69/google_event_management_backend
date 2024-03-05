const jwt = require("jsonwebtoken");
const checkIfAuthenticated = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];

    if (authorizationHeader) {
      const [bearer, token] = authorizationHeader.split(" ");
      if (bearer === "Bearer" && token) {
        try {
          jwt.verify(token, process.env.JWT_SECRET_STRING);
          next(); // User is authenticated, proceed to the next middleware or route handler
        } catch (error) {
          console.log("JWT verification failed:", error);
          return res.status(401).json({ message: "Unauthorized" });
        }
      } else {
        return res
          .status(401)
          .json({ message: "Invalid Authorization Header" });
      }
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = checkIfAuthenticated;
