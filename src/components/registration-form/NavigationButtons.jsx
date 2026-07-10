import { useState } from "react";
import { z } from "zod";
import { useAthleteRegistrationStore } from "../../stores/useRegistrationStore";
import apiUrl from "../../config/api.conf";
import envConfig from "../../config/env.conf";
import { toast } from "react-toastify";

// Pre-configured validation schema matching backend rules cleanly
// eslint-disable-next-line react-refresh/only-export-components
export const athleteSchema = z.object({
  playerName: z.string().min(1, "Player Name is required"),
  fathersName: z.string().min(1, "Father's Name is required"),
  mothersName: z.string().min(1, "Mother's Name is required"),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
  emailAddress: z.string().email("Invalid email address format"),
  contactNumber: z
    .string()
    .trim()
    .regex(/^(?:\+91|91)?[6-9]\d{9}$/, {
      message: "Invalid primary mobile number syntax",
    }),
  alternateMobileNo: z
    .string()
    .trim()
    .regex(/^(?:\+91|91)?[6-9]\d{9}$/, {
      message: "Invalid alternate mobile number syntax",
    })
    .or(z.literal("")),
  address: z.string().min(1, "Street Address is required"),
  pinCode: z.string().min(1, "Pin Code is required"),
  stateOrProvince: z.string().min(1, "State or Province is required"),
  country: z.string().min(1, "Country is required"),
  club: z.string().min(1, "Club affiliation is required"),
  sports: z.string().min(1, "Primary Sport discipline is required"),
  fileTitles: z.array(z.string()).optional(),
  competitions: z
    .array(
      z.object({
        competitionName: z.string().min(1, "Competition Name is required"),
        sports: z.string().min(1, "Sport type is required"),
        category: z.string().optional(),
        position: z.string().optional(),
      }),
    )
    .optional(),
});

const NavigationButtons = () => {
  const { currentStep, nextStep, previousStep, goToStep } =
    useAthleteRegistrationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const handleSubmit = async () => {
    setValidationErrors([]);
    const state = useAthleteRegistrationStore.getState();

    const payloadData = {
      playerName: state.playerName,
      fathersName: state.fathersName,
      mothersName: state.mothersName,
      dateOfBirth: state.dateOfBirth,
      gender: state.gender,
      emailAddress: state.emailAddress,
      contactNumber: state.contactNumber,
      alternateMobileNo: state.alternateMobileNo || "",
      address: state.address,
      pinCode: state.pinCode,
      stateOrProvince: state.stateOrProvince,
      country: state.country,
      club: state.club,
      sports: state.sports,
      fileTitles: state.fileTitles,
      competitions: state.competitions,
    };

    const validationResult = athleteSchema.safeParse(payloadData);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`,
      );
      setValidationErrors(errors);
      toast.error("Validation failed. Please review your entries.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();

    Object.keys(payloadData).forEach((key) => {
      if (
        key !== "competitions" &&
        key !== "fileTitles" &&
        payloadData[key] !== null &&
        payloadData[key] !== undefined
      ) {
        formData.append(key, payloadData[key]);
      }
    });

    if (state.profilePhoto) {
      formData.append("profile_photo", state.profilePhoto);
    }

    state.playerDocuments.forEach((file, index) => {
      if (file) {
        formData.append("players_document", file);
        formData.append(
          `fileTitles[${index}]`,
          state.fileTitles[index] || `Doc_${index}`,
        );
      }
    });

    formData.append(
      "competitions",
      JSON.stringify(payloadData.competitions || []),
    );

    try {
      const uploadResponse = await apiUrl.post(
        envConfig.POST_NEW_ATHLETE_DETAILS_URL,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (uploadResponse && uploadResponse.data) {
        toast.success(
          <div>
            <strong className="text-green-600">Successful!</strong>
            <p className="text-xs text-gray-700">
              {uploadResponse.data.details || "Registration data processed."}
            </p>
          </div>,
        );

        if (uploadResponse.data.details === "Email already verified.") {
          // Changed variable identifier to 'dbResponse' to bypass shadowing vulnerabilities
          const dbResponse = await apiUrl.post(
            envConfig.PUSH_NEW_ATHLETE_DETAILS_TO_DB_URL,
            { verificationOtp: "" },
            {
              withCredentials: true,
            },
          );

          if (!dbResponse || !dbResponse.data) {
            toast.error(
              <div>
                <strong className="text-rose-600">Failed!</strong>
                <p className="text-xs text-gray-800">
                  Empty response body returned from DB pipeline gateway.
                </p>
              </div>,
            );
          } else {
            goToStep(8);
            toast.success(
              <div>
                <strong className="text-green-600">Successful!</strong>
                <p className="text-xs text-gray-800">
                  {dbResponse.data.details}
                </p>
              </div>,
            );
          }
        } else {
          nextStep();
        }
      } else {
        toast.error(
          <div>
            <strong className="text-rose-600">Failed!</strong>
            <p className="text-xs text-gray-800">
              Empty response body returned from initial upload API gateway.
            </p>
          </div>,
        );
      }
    } catch (error) {
      console.error("Critical submission runtime exception caught:", error);
      toast.error(
        <div>
          <strong className="text-rose-600">Submission Failure</strong>
          <p className="text-xs text-gray-800">
            {error.response?.data?.message ||
              "Server communication error occurred during validation execution."}
          </p>
        </div>,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {validationErrors.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl space-y-1">
          <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider">
            Submission Blocked by Validation Rules:
          </h4>
          <ul className="list-disc pl-4 text-[11px] text-rose-600 font-medium">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={previousStep}
          disabled={currentStep === 1 || isSubmitting}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentStep === 1 || isSubmitting
              ? "text-slate-300 cursor-not-allowed"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          Back
        </button>

        <button
          type="button"
          onClick={currentStep === 6 ? handleSubmit : nextStep}
          disabled={isSubmitting}
          className="px-6 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50"
        >
          {isSubmitting
            ? "Submitting..."
            : currentStep === 6
              ? "Submit Registration"
              : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default NavigationButtons;
