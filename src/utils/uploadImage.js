const multer = require('multer');
const AppError = require('./appError');

const FILE_TYPE = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg'
}

const storageFile = multer.memoryStorage()

const filterImageType = async (req, file, cb) => {
  const isValidFormat = FILE_TYPE[file.mimetype];
  let uploadError = new AppError('Image must be valid mime type');

  if (!isValidFormat) {
    cb(uploadError);
  }

  cb(null, true);
}

const uploadOption = multer({
  storage: storageFile,
  fileFilter: filterImageType,
  limits: {
    fileSize: 10 * Math.pow(1024, 2)
  }
})

module.exports = uploadOption;