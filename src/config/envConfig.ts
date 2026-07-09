import "dotenv/config";

const environment = {
    port: process.env.PORT || 3000,

    cloudinary_name: process.env.CLOUDINARY_NAME || "",
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY || "",
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET || "",
    database_url: process.env.DATABASE_URL || ""

}

const envConfig = Object.freeze(environment);
export default envConfig