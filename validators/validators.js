const { body, query, validationResult } = require("express-validator")

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    })
  }
  next()
}

const addSchoolValidators = [
  body("name")
    .trim()
    .notEmpty().withMessage("School name is required")
    .isLength({ max: 255 }).withMessage("Name must be ≤ 255 characters"),
 
  body("address")
    .trim()
    .notEmpty().withMessage("Address is required")
    .isLength({ max: 500 }).withMessage("Address must be ≤ 500 characters"),
 
  body("latitude")
    .notEmpty().withMessage("Latitude is required").bail()
    .isFloat({ min: -90, max: 90 }).withMessage("Latitude must be a number between -90 and 90"),
 
  body("longitude")
    .notEmpty().withMessage("Longitude is required").bail()
    .isFloat({ min: -180, max: 180 }).withMessage("Longitude must be a number between -180 and 180"),
 
  handleValidationErrors,
]

const listSchoolsValidators = [
  query("latitude")
    .notEmpty().withMessage("Query param 'latitude' is required").bail()
    .isFloat({ min: -90, max: 90 }).withMessage("Latitude must be a number between -90 and 90"),
 
  query("longitude")
    .notEmpty().withMessage("Query param 'longitude' is required").bail()
    .isFloat({ min: -180, max: 180 }).withMessage("Longitude must be a number between -180 and 180"),
 
  handleValidationErrors,
]

module.exports = { addSchoolValidators, listSchoolsValidators }