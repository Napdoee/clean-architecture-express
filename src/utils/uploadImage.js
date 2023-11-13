const multer = require('multer');
const AppError = require('./appError');

const FILE_TYPE = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg'
}

const storageFile = multer.diskStorage({
  destination: function(req, file, cb) {
    const isValidFormat = FILE_TYPE[file.mimetype];
    let uploadError = new AppError('invalid image type');

    if (isValidFormat) {
      uploadError = null;
    }

    cb(uploadError, 'public/image')
  },
  filename: function(req, file, cb) {
    const extension = FILE_TYPE[file.mimetype];
    const uniqueFileImage = 'image-' + Date.now() + '.' + extension;

    cb(null, uniqueFileImage)
  }
})

const uploadOption = multer({ storage: storageFile })

module.exports = uploadOption;