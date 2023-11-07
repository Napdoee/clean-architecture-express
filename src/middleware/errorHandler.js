const AppError = require('../utils/appError');

const errorHandler = (error, req, res, next) => {

  if (error instanceof AppError) {
    if (error.message !== "null") {
      return res.status(error.statusCode).send({
        status: 'fail',
        type: 'APP_ERROR',
        message: error.message
      })
    }

    return res.sendStatus(error.statusCode);
  }

  console.log(error);
  return res.status(500).send({
    status: 'fail',
    type: 'SERVER_ERROR',
    message: 'Something went wrong'
  })
}

module.exports = errorHandler;