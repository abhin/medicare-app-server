import jwt from "jsonwebtoken";

export function generateAccessToken(jsonObject, expiresIn = "1h") {
  return jwt.sign(jsonObject, process?.env?.JWT_KEY, {
    expiresIn,
  });
}

export const verifyAccessToken = (token) => {
  
  try {
    if (!token) {
      return { success: false, message: "Token is missing.", statusCode: 401 };
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    return { success: true, message: "Token is valid", decoded: decoded };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return {
        success: false,
        message: "Token has expired. Please request a new one.",
        statusCode: 401,
      };
    }
    if (error.name === "JsonWebTokenError") {
      return {
        success: false,
        message: "Invalid token. Authentication failed.",
        statusCode: 401,
      };
    }
    return {
      success: false,
      message: "An error occurred while validating the token.",
      error: error.message,
      statusCode: 500,
    };
  }
};
