import { body } from "express-validator";
import Departments from "../models/departments.js";
import { verifyUser } from "./auth.js";
import {
  requiredFieldValidation,
  requiredParamValidation,
  getValidationResult,
} from "../utils/validator.js";

export const checkDepartmentsExistence = async (req, res, next) => {
  const { _id } = req.params;
  const { name } = req.body;

  try {
    if (_id) {
      const existsById = await Departments.exists({ _id });

      if (!existsById) {
        return res.status(404).json({
          success: false,
          message: "Department does not exist with the provided ID.",
        });
      }
    }

    if (name) {
      const existsByName = await Departments.exists({ name });

      if (existsByName) {
        return res.status(409).json({
          success: false,
          message: "Department already exists with this name.",
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while checking department existence.",
      error: error.message,
    });
  }
};

export const validateCreate = () => [
  verifyUser,
  requiredFieldValidation("name", 3),
  checkDepartmentsExistence,
  getValidationResult,
];

export const validateUpdate = () => [
  verifyUser,
  body("name").optional().isLength({ min: 3 }),
  body("description")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters long"),
  getValidationResult,
];

export const validateDelete = () => [
  verifyUser,
  requiredParamValidation("_id").isMongoId().withMessage("Invalid ID."),
  checkDepartmentsExistence,
  getValidationResult,
];

export const validateGetDepartment = () => [
  requiredParamValidation("_id").isMongoId().withMessage("Invalid ID."),
  checkDepartmentsExistence,
  getValidationResult,
];
