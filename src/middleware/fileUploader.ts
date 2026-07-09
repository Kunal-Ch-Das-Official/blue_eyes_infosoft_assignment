import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
// Configure memory storage
const storage = multer.memoryStorage();

// Define file filter for specific file types (e.g., images and PDF)
export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback, // Use FileFilterCallback directly
) => {
  const validMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/avif",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/heic",
    "image/heif",
    "image/jpeg",
    "image/bmp",
    "image/tiff",
    "image/vnd.ms-photo",
    "application/pdf",
    "application/postscript",
    "image/vnd.adobe.photoshop",
    "image/x-xcf",
    "image/x-icon",
    "image/vnd.microsoft.icon",
    "image/x-tga",
    "image/x-dds",
    "image/x-exr",
    "image/vnd.radiance",
    "image/x-pcx",
    "image/x-ilbm",
    "image/x-pict",
  ];

  if (validMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, WEBP, SVG, AVIF, and PDF files are allowed.",
      ),
    );
  }
};

// Create multer instance with memory storage and file filter
const fileUploader = multer({
  storage,
  fileFilter,
  limits: {
    files: 25, // max 25 files
    fileSize: 25 * 1024 * 1024, // max file size 25MB
  },
});

// Export the multer uploader
export default fileUploader;
