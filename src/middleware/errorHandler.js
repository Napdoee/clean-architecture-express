const AppError = require('../utils/appError');

const errorHandler = (error, req, res, next) => {

  if (error instanceof AppError) {
    if (error.message !== "null") {
      return res.status(error.statusCode).send({
        status: 'failed',
        type: 'APP_ERROR',
        error: error.message
      })
    }

    return res.sendStatus(error.statusCode);
  }

  console.log(error);
  return res.status(500).send({
    status: 'failed',
    type: 'SERVER_ERROR',
    error: 'Something went wrong'
  })
}

module.exports = errorHandler;