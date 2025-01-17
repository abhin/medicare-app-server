import multer from "multer";
import fs from "fs";
import path from "path";
import awsStorage from "../configs/awsS3.js"

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = `uploads/${file.fieldname}`;
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    console.log("file", file);
    cb(null, req?.authUser?.uId + path.extname(file.originalname));
  },
});

export const folderUpload = multer({ diskStorage });


export const awsUpload = multer({
  storage: awsStorage,
  limits: { fileSize: 50000 /* bytes */ }
});
