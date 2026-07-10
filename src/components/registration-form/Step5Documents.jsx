import { useRef, useState } from "react";
import { useAthleteRegistrationStore } from "../../stores/useRegistrationStore";
import TextInput from "../../utils/form-inputs/TextInput";

const Step5Documents = () => {
  const {
    profilePhoto,
    playerDocuments,
    fileTitles,
    setProfilePhoto,
    setPlayerDocuments,
    setFileTitles,
  } = useAthleteRegistrationStore();

  const [compressionLoading, setCompressionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const profileInputRef = useRef(null);

  // --- COMPRESSION UTILITIES ---

  // Compresses image files to fit under 1MB target by adjusting canvas quality layers
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Scale down image dimensions if excessively massive to reduce initial data footprint
          const MAX_DIMENSION = 2000;
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
              height = Math.round((height * MAX_DIMENSION) / width);
              width = MAX_DIMENSION;
            } else {
              width = Math.round((width * MAX_DIMENSION) / height);
              height = MAX_DIMENSION;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert canvas frame output down using an optimized 0.7 compression ratio layer
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error("Canvas image conversion failed"));
              }
            },
            "image/jpeg",
            0.7,
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handles individual file selection pipelines (PDF limits / Image compression routing)
  const processFile = async (file) => {
    const sizeInMB = file.size / (1024 * 1024);

    if (file.type === "application/pdf") {
      if (sizeInMB > 2) {
        throw new Error(
          `PDF "${file.name}" exceeds the 2MB limit. Please optimize the file size.`,
        );
      }
      return file;
    } else if (file.type.startsWith("image/")) {
      if (sizeInMB > 1) {
        return await compressImage(file);
      }
      return file;
    } else {
      throw new Error(
        "Unsupported format. Only JPG, PNG, and PDF files are accepted.",
      );
    }
  };

  // --- ACTIONS ---

  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCompressionLoading(true);
    setErrorMessage("");
    try {
      const processed = await processFile(file, "profile");
      setProfilePhoto(processed);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setCompressionLoading(false);
    }
  };

  const handleAddDocumentRow = () => {
    if (playerDocuments.length < 10) {
      setPlayerDocuments([...playerDocuments, null]);
      setFileTitles([...fileTitles, ""]);
    }
  };

  const handleRemoveDocumentRow = (index) => {
    const updatedDocs = playerDocuments.filter((_, i) => i !== index);
    const updatedTitles = fileTitles.filter((_, i) => i !== index);
    setPlayerDocuments(updatedDocs);
    setFileTitles(updatedTitles);
  };

  const handleTitleChange = (index, value) => {
    const updatedTitles = [...fileTitles];
    updatedTitles[index] = value;
    setFileTitles(updatedTitles);
  };

  const handleDocumentFileChange = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCompressionLoading(true);
    setErrorMessage("");
    try {
      const processed = await processFile(file, "document");
      const updatedDocs = [...playerDocuments];
      updatedDocs[index] = processed;
      setPlayerDocuments(updatedDocs);
    } catch (err) {
      setErrorMessage(err.message);
      e.target.value = ""; // Reset standard file reference on rejection
    } finally {
      setCompressionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Universal Message Banner */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Document Uploads
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload profile pictures and identity documents. Images over 1MB are
          automatically optimized; PDFs must not exceed 2MB.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* --- PROFILE PICTURE CARD --- */}
      <div className="p-6 border border-gray-200 rounded-xl bg-gray-50/50 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-28 h-28 bg-white border border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner relative group">
          {profilePhoto ? (
            <img
              src={URL.createObjectURL(profilePhoto)}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-2 text-gray-400">
              <svg
                className="mx-auto h-8 w-8 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-[10px] font-semibold tracking-wide uppercase mt-1 block">
                No Image
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left">
          <h3 className="text-sm font-semibold text-gray-700">
            Profile Portrait Photo
          </h3>
          <p className="text-xs text-gray-400">
            Upload a recent headshot. Supported formats: JPG, PNG.
          </p>
          <input
            type="file"
            ref={profileInputRef}
            onChange={handleProfileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            disabled={compressionLoading}
            onClick={() => profileInputRef.current?.click()}
            className="px-4 py-2 text-xs font-bold text-blue-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all cursor-pointer"
          >
            {compressionLoading
              ? "Processing..."
              : profilePhoto
                ? "Change Photo"
                : "Choose Image"}
          </button>
        </div>
      </div>

      {/* --- DOCUMENT ARRAY MANAGEMENT --- */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-800">
              Supporting Records & Certificates
            </h3>
            <p className="text-xs text-gray-400">
              Attach verification elements, government cards, or birth
              registries (Max 10).
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddDocumentRow}
            disabled={playerDocuments.length >= 10 || compressionLoading}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              playerDocuments.length >= 10
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-100"
            }`}
          >
            + Add Document
          </button>
        </div>

        {playerDocuments.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <p className="text-xs text-gray-400 font-medium">
              No verified verification attachments configured yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {playerDocuments.map((doc, index) => (
              <div
                key={index}
                className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col gap-4 relative transition-all hover:border-sky-100"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">
                    Attachment Unit #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDocumentRow(index)}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
           <div>
                   <TextInput
                    inputLabel="Document Identity Title"
                    fieldId={`docTitle-${index}`}
                    values={fileTitles[index] || ""}
                    placeHolderText="e.g., Passport, Birth Certificate"
                    isRequired={true}
                    textValue={(val) => handleTitleChange(index, val)}
                  />
           </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-600">
                      File Attachment <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        required={!doc}
                        accept="image/*,application/pdf"
                        onChange={(e) => handleDocumentFileChange(index, e)}
                        className="
                          w-full rounded-xl border border-gray-300 bg-white
                          px-3 py-1.5 text-xs text-gray-500 shadow-sm
                          file:mr-4 file:py-1 file:px-3 file:rounded-lg
                          file:border-0 file:text-xs file:font-semibold
                          file:bg-blue-50 file:text-blue-600
                          hover:file:bg-blue-100 transition-all outline-none
                        "
                      />
                    </div>
                    {doc && (
                      <span className="text-[11px] text-green-600 font-semibold flex items-center gap-1 ml-1 mt-0.5">
                        ✓ Attached: {(doc.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Step5Documents;
