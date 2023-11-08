const { checkSchema } = require("express-validator");

const userPostValidateSchema = checkSchema({
  name: {
    exists: {
      errorMessage: 'name is required',
      options: { checkFalsy: true }
    },
    isString: {
      errorMessage: 'name should be string'
    },
    isLength: {
      options: { min: 3 },
      errorMessage: 'name should be at least 3 characters'
    }
  },
  email: {
    isEmail: {
      errorMessage: 'provide a valid email'
    },
  },
  password: {
    exists: {
      errorMessage: 'password is required'
    },
    isString: {
      errorMessage: 'password should be string'
    },
    isLength: {
      options: { min: 5 },
      errorMessage: 'password should be at least 5 characters'
    }
  },
  confirmPassword: {
    custom: {
      if: (value, { req }) => value !== req.body.password,
      errorMessage: 'password not match'
    },
  }
});

const loginValidateSchema = checkSchema({
  email: {
    isEmail: {
      errorMessage: 'provide a valid email'
    },
  },
  password: {
    exists: {
      errorMessage: 'password is required'
    },
    isString: {
      errorMessage: 'password should be string'
    },
    isLength: {
      options: { min: 5 },
      errorMessage: 'password should be at least 5 characters'
    }
  },
})

module.exports = { userPostValidateSchema, loginValidateSchema }