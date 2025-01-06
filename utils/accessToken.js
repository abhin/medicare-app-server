import jwt from "jsonwebtoken";

export function generateAccessToken(uId, expiresIn = "1h") {
  return jwt.sign({ uId }, process?.env?.JWT_KEY, {
    expiresIn,
  });
}
