import jwt from "jsonwebtoken";

// This function generates a JWT and sets it as an HTTP-only cookie in the response.
const generateTokenAndSetCookie = (userId, res) => {
  // 1. Create the token
  // The first argument is the payload (data you want to store).
  // The second is the JWT_SECRET from your environment variables.
  // The third is an options object (e.g., setting an expiration date).
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d", // The token will expire in 15 days
  });

  // 2. Set the token as a cookie in the response
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie (for security)
    sameSite: "strict", // Helps prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development", // The cookie will only be sent over HTTPS in production
  });

  // Return the token so it can also be sent in the response body if needed
  return token;
};

export default generateTokenAndSetCookie;