import multerS3 from "multer-s3";
import awsSDK from "aws-sdk";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

awsSDK.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});

const awsS3Service = new awsSDK.S3();
const awsStorage = multerS3({
  s3: awsS3Service,
  acl: "public-read",
  bucket: process?.env?.AWS_S3_BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    console.log("awsStorage = multerS3:: file", file);
    if (file.originalname) {
      return cb(null, req.accessKeyValue + path.extname(file.originalname));
    } else {
      return cb(new Error("File name is missing or invalid"), null);
    }
  },
});

export default awsStorage;
