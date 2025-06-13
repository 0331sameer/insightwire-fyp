const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token =
    req.header("x-auth-token") ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Handle mock tokens for development
    if (token === "mock-jwt-token" || token === "mock-google-jwt-token") {
      // Use user ID from custom header if present (for dev)
      req.user = req.header("x-mock-user-id") || "mock-user-id-12345";
      return next();
    }

    // Handle real JWT tokens
    const jwtSecret = process.env.JWT_SECRET || "fallback-secret-key";
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.id;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = auth;
