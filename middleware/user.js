import { body } from "express-validator";
import Users from "../models/users.js";
import { verifyUser } from "./auth.js";
import {
  requiredFieldValidation,
  requiredParamValidation,
  getValidationResult,
} from "../utils/validator.js";

export const checkUsersExistence = async (req, res, next) => {
  const { _id } = req.params;
  const { email } = req.body;

  try {
    if (_id) {
      const existingUserById = await Users.exists({ _id });

      if (!existingUserById) {
        return res.status(404).json({
          success: false,
          message: "User does not exist with the provided ID.",
        });
      }
    }

    if (email) {
      const existingUserByEmail = await Users.exists({ email });

      if (existingUserByEmail) {
        return res.status(409).json({
          success: false,
          message: "User already exists with this email.",
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while checking user existence.",
      error: error.message,
    });
  }
};

export const validateCreate = () => [
  requiredFieldValidation("name", 3),
  requiredFieldValidation("email")
    .isEmail()
    .withMessage("Invalid email address format")
    .customSanitizer((value) => value.toLowerCase()),
  requiredFieldValidation("password", 6),
  checkUsersExistence,
  getValidationResult,
];

export const validateUpdate = () => [
  verifyUser,
  body("name").optional().isLength({ min: 3 }),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address format")
    .bail()
    .customSanitizer((value) => value.toLowerCase())
    .custom(async (value, { req }) => {
      const existingUser = await Users.findOne({
        email: value,
        _id: { $ne: req.accessKeyValue },
      });
      if (existingUser) {
        throw new Error("Email is already in use.");
      }
      return true;
    }),
  body("password")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  getValidationResult,
];

export const validateDelete = () => [
  verifyUser,
  requiredParamValidation("_id").isMongoId().withMessage("Invalid ID."),
  checkUsersExistence,
  getValidationResult,
];

export const validateActivation = () => [
  requiredParamValidation("token"),
  verifyUser,
  async (req, res, next) => {
    try {
      const user = await Users.findById(req.accessKeyValue);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      if (user.status) {
        return res.status(400).json({
          success: false,
          message: "Account is already activated.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error while validating user activation.",
        error: error.message,
      });
    }
  },
  getValidationResult,
];

export const validateGetUser = () => [
  requiredParamValidation("_id").isMongoId().withMessage("Invalid ID."),
  checkUsersExistence,
  getValidationResult,
];
