import blobStorageConfig from "../../config/blobStorageConf";

const blobDestroyer = async (requiredPublicId: string): Promise<void> => {
  const resourceTypes: string[] = ["image", "video", "raw"];

  let deletedSuccessfully = false;

  for (const resourceType of resourceTypes) {
    try {
      // Attempt to destroy the resource with the current resourceType
      const result = await blobStorageConfig.uploader.destroy(
        requiredPublicId,
        {
          resource_type: resourceType,
        },
      );

      if (result && result.result === "ok") {
        console.log({
          message: `Requested file (type: ${resourceType}) has been removed from cloudinary!`,
          result: requiredPublicId,
        });
        deletedSuccessfully = true;
        break; // If successfully deleted, no need to try other resource types
      } else if (result && result.result === "not found") {
        console.log({
          message: `File (type: ${resourceType}) with public ID '${requiredPublicId}' not found. Trying next type...`,
        });
      }
    } catch (error: unknown) {
      // Log the error but continue trying other resource types if a specific type fails
      console.error({
        issue: (error as Error).message,
        details: `Failed to destroy resource of type '${resourceType}' for public ID '${requiredPublicId}'.`,
        issueOrigin: "custom single destroyer.",
      });
    }
  }

  if (!deletedSuccessfully) {
    console.error({
      issue: "Unable to destroy requested resources across all common types!",
      details: `Could not find or destroy resource with public ID '${requiredPublicId}' using known resource types.`,
      issueOrigin: "custom single destroyer.",
    });
  }
};

export default blobDestroyer;
