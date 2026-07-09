import blobStorageConfig from "../../config/blobStorageConf";

const multipleBlobDestroyer = async (
  requiredPublicIds: string[],
): Promise<void> => {
  const resourceTypes = ["image", "video", "raw"]; // Add other resource types if needed

  for (const resourceType of resourceTypes) {
    try {
      await blobStorageConfig.api
        .delete_resources(requiredPublicIds, {
          type: "upload",
          resource_type: resourceType, // Dynamically setting the resource type
        })
        .then(() => {
          console.log({
            message: `Requested files of type '${resourceType}' have been removed from Cloudinary!`,
            result: requiredPublicIds,
          });
        });
    } catch (error: unknown) {
      console.error({
        issue: (error as Error).message,
        details: `Unable to destroy requested resources of type '${resourceType}'!`,
        issueOrigin: "custom single destroyer.",
      });
    }
  }
};

export default multipleBlobDestroyer;
