import multer from 'multer';

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp'); // Specify the destination directory  
    }, 
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Specify the file name
    }
});

export const upload = multer({ storage: storage });

export const uploadSingle = (fieldName) => upload.single(fieldName);

export const uploadMultiple = (fieldName, maxCount) => upload.array(fieldName, maxCount);

export const uploadFields = (fields) => upload.fields(fields);

export default upload;




