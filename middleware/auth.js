// import { Strategy } from "passport-google-oauth20";

import { verifyAccessToken } from "../utils/accessToken";

export const verifyUser = (req, res, next) => {
  const token = req.headers.authorization || req.params.token;

  try {
    const result = verifyAccessToken(token);
    const { success, message, statusCode, decoded } = result;    

    if (!success) {
      return res.status(statusCode).json({ success, message });
    }

    req._id = decoded?._id;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while verifying the user.",
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
