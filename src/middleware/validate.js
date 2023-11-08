const { validationResult } = require("express-validator");

const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    return res.status(400).send({
      status: 'failed',
      type: 'REQUEST_ERROR',
      errors: errors.mapped()
    })
  }
}

module.exports = validate;