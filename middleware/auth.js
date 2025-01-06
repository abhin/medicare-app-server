import jwt from "jsonwebtoken";
import { Strategy } from "passport-google-oauth20";

export function verifyUserLogin(req, res, next) {
  const token = req.headers.authorization;

  try {
    if (!token) throw new Error("Invalid access token");

    const data = jwt.verify(token, process?.env?.JWT_KEY);
    req.authUser = data;
    next();
  } catch (error) {
    res.status(200).json({
      success: false,
      invalidToken: true,
      message: error.message,
    });
  }
}

export const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization || req.params.token;

  try {
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token is missing." });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req._id = decoded?.uId;

    if (!req._id) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload." });
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please request a new one.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Authentication failed.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "An error occurred while validating the token.",
      error: error.message,
    });
  }
};

export const googleStrategy = () => {
  return new Strategy(
    {
      clientID: process?.env?.GOOGLE_CLIENT_ID,
      clientSecret: process?.env?.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_HOST_URL}/api/v1/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, cb) {
      try {
        return cb(null, { profile });
      } catch (error) {
        return cb(error);
      }
    }
  );
};
