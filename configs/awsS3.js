import multerS3 from "multer-s3";
import awsSDK from "aws-sdk";
import dotenv from "dotenv";

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
    return cb(null, req.accessKeyValue + path.extname(file.originalname));
  },
});

export default awsStorage;
