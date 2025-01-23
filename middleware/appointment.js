import { body } from "express-validator";
import Chats from "../models/chats.js";
import { verifyUser } from "./auth.js";
import {
  requiredFieldValidation,
  requiredParamValidation,
  getValidationResult,
} from "../utils/validator.js";

export const validateCreate = () => [
  verifyUser,
  requiredFieldValidation("users"),
  requiredFieldValidation("sender"),
  requiredFieldValidation("roomId"),
  requiredFieldValidation("messageType"),
  requiredFieldValidation("content", 1),
  getValidationResult,
];

export const validateUpdate = () => [
  requiredFieldValidation("_id"),
  requiredFieldValidation("messageType"),
  requiredFieldValidation("content", 1),
  getValidationResult,
];

export const validateGetAll = () => [
  requiredFieldValidation("roomId"),
  getValidationResult,
];

export const validateDelete = () => [
  verifyUser,
  requiredParamValidation("_id").isMongoId().withMessage("Invalid ID."),
  getValidationResult,
];

export const validateGet = () => [
  requiredParamValidation("_id").isMongoId().withMessage("Invalid ID."),
  getValidationResult,
];
