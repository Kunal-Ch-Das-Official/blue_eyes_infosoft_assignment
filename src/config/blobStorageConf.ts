import { v2 as cloudinary } from "cloudinary";
import envConfig from "./envConfig";

//! Create cloudinary config
cloudinary.config({
  cloud_name: envConfig.cloudinary_name,
  api_key: envConfig.cloudinary_api_key,
  api_secret: envConfig.cloudinary_api_secret,
});
const blobStorageConfig = cloudinary;
export default blobStorageConfig;