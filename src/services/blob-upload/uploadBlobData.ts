import streamifier from "streamifier";
import { UploadApiResponse } from "cloudinary";
import sharp from "sharp";
import { TypeFile } from "../../types/TypeFiles";
import blobStorageConfig from "../../config/blobStorageConf";

export interface UploadedDocument {
  documentName: string;
  documentType: string;
  documentUrl: string;
  documentAccessUrl: string;
  documentSize: number;
}

const uploadBlobData = async (
  entireFile: TypeFile,
  folderName: string,
  documentName?: string | null,
): Promise<UploadedDocument | null> => {
  let fileBuffer: Buffer = entireFile.buffer;
  const isImage = entireFile.mimetype.startsWith("image/");
  const resourceType = isImage ? "image" : "auto";

  // Convert supported image formats to WebP
  if (
    [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
      "image/heic",
      "image/heif",
      "image/bmp",
      "image/tiff",
      "image/x-tga",
      "image/x-dds",
      "image/x-pcx",
    ].includes(entireFile.mimetype)
  ) {
    fileBuffer = await sharp(entireFile.buffer)
      .webp({ quality: 90 })
      .toBuffer();
  }

  const uploadedSize = fileBuffer.length;

  try {
    return await new Promise<UploadedDocument>((resolve, reject) => {
      const uploadStream = blobStorageConfig.uploader.upload_stream(
        {
          folder: folderName,
          resource_type: resourceType,
          format: isImage ? "webp" : undefined,
          timeout: 240000,
        },
        (error: unknown, result: UploadApiResponse | undefined) => {
          if (error) {
            return reject(error);
          }

          if (!result?.secure_url || !result.public_id) {
            return reject(
              new Error("Upload result is undefined or missing properties."),
            );
          }

          resolve({
            documentName,
            documentType: isImage ? "image/webp" : entireFile.mimetype,
            documentUrl: result.secure_url,
            documentAccessUrl: result.public_id,
            documentSize: uploadedSize,
          });
        },
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  } catch (error) {
    console.error({
      status: 500,
      issue: "Cloudinary uploader error!",
      issueOrigin: "CloudinaryUploader.uploadSingle",
      message: (error as Error).message,
    });

    return null;
  }
};

export default uploadBlobData;
