const { Prisma } = require('@prisma/client');
const AppError = require('../utils/appError');

const handlePrismaError = (err) => {
  switch (err.code) {
    case 'P2002':
      return `${err.meta.target} must be unique`;
    default:
      return `Something went wrong`;
  }
}

const errorHandler = (error, req, res, next) => {

  if (error instanceof AppError) {
    if (error.message !== "null") {
      return res.status(error.statusCode).send({
        status: 'failed',
        type: 'CLIENT_ERROR',
        error: error.message
      })
    }

    return res.sendStatus(error.statusCode);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(500).send({
      status: 'failed',
      type: 'APP_REQUEST_ERROR',
      error: handlePrismaError(error)
    })
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(500).send({
      status: 'failed',
      type: 'APP_VALIDATION_ERROR',
      error: error
    })
  }

  console.log(error);
  return res.status(500).send({
    status: 'failed',
    type: 'SERVER_ERROR',
    error: 'Something went wrong'
  })
}

module.exports = errorHandler;