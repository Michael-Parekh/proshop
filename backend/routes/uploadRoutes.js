import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Call the callback function (pass in 'null' because there are no errors and upload to a file called 'uploads').
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    ); // Call the callback function (pass in 'null' because there are no errors and give the uploaded file a unique name).
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/; // Accepted filetypes.
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // This boolean's value depends on whether or not the file's extension matches one of the accepted 'filetypes'.
  const mimetype = filetypes.test(file.mimetype); // One of the 'filetypes' has to be in the file's mimetype.

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

// Middleware for handling 'multipart/form-data', which is primarily used for uploading files.
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Pass in 'upload.single('image')' as middleware (when we upload a single image on the frontend, we need to call it 'image').
router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`); // This will give us the 'path' (which we can set to the 'image' state on our frontend).
});

export default router;
