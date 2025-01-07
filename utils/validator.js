import { body, validationResult, param } from "express-validator";

const capitalizeField = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const requiredFieldValidation = (field, minLength = 0) => {
  let validateBody = body(field)
    .exists({ checkFalsy: true })
    .withMessage(`${capitalizeField(field)} is required`)
    .bail()
    .notEmpty()
    .withMessage(`${capitalizeField(field)} should not be empty`)
    .trim()
    .bail();

  if (minLength > 0) {
    validateBody = validateBody
      .isLength({ min: minLength })
      .withMessage(
        `${capitalizeField(field)} should be at least ${minLength} characters long`
      );
  }

  return validateBody.bail();
};

export const requiredParamValidation = (paramName) => {
  return param(paramName)
    .exists()
    .withMessage(`${paramName} is required.`)
    .bail();
};

export function getValidationResult(req, res, next) {
  try {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return next();
    }

    const errorMessages = result.array().map((error) => error.msg);

    res.status(400).json({
      success: false,
      message: errorMessages.join(", "),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
