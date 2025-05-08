// middleware/upload.js
import multer from "multer";
import path from "path";

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Folder to store uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    },
});

const upload = multer({ storage });

export default upload;
