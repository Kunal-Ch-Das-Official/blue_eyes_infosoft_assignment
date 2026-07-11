import { Eye, CheckCircle, Phone, Award, User, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import StatusUpdateConfirmation from "../../utils/modals/StatusUpdateConfirmation";
import apiUrl from "../../config/api.conf";
import envConfig from "../../config/env.conf";
import { toast } from "react-toastify";

export default function AthleteCard({ athlete, setIsStatusChanged }) {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);

  const handleUpdateStatus = (athlete) => {
    setSelectedAthlete(athlete);
    setIsModalOpen(true);
  };

  // FIX 1: Receive the fresh decision string directly as an argument
  const handleUpdateDecisions = async (freshStatus) => {
    // If called without an explicit status parameter, fallback to current state
    const targetStatus = freshStatus || applicationStatus;

    if (!targetStatus) {
      toast.error("Invalid application status action targeted.");
      return;
    }

    try {
      setLoading(true);

      // FIX 2: Use targetStatus instead of the stale applicationStatus state
      const response = await apiUrl.post(
        `${envConfig.RESPONSE_PLAYERS_URL}?formDataId=${athlete.id}&status=${targetStatus}`,
        {},
        { withCredentials: true },
      );

      if (!response.data) {
        throw new Error("Response data is empty.");
      } else {
        toast.success(
          <div>
            <strong className="text-green-600">Successful!</strong>
            <p className="text-xs text-gray-700">
              {response.data.details || "Roster status modified successfully."}
            </p>
          </div>,
        );
      }
    } catch (error) {
      // FIX 3: Use toast directly here to avoid breaking Hook rules with InternalErrorRes
      toast.error(
        <div>
          <strong className="text-rose-600">System Error</strong>
          <p className="text-xs text-gray-700">
            {error.message || "Internal network handshake failed."}
          </p>
        </div>,
      );
    } finally {
      setLoading(false);
      setIsStatusChanged(true);
    }
  };

  if (!athlete) return null;

  const {
    playerName = "Unknown Athlete",
    contactNumber = "N/A",
    currentAge = "N/A",
    formStatus = "APPLIED",
    competitionPlayed = [],
  } = athlete;

  const primaryComp = competitionPlayed[0] || {};
  const {
    category = `Age Group: ${currentAge}`,
    sports = "Unspecified Sport",
    competitionName = "No Active Application",
    position = "N/A",
  } = primaryComp;

  const statusStyles = {
    APPLIED: "bg-amber-50 text-amber-700 border-amber-200",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <>
      {loading ? (
        <div className="w-full min-h-55 flex flex-col items-center justify-center gap-4 text-slate-400 bg-white border border-slate-200 rounded-xl">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
          <p className="text-xs tracking-wide animate-pulse text-slate-500">
            Updating ledger matrices...
          </p>
        </div>
      ) : (
        <main>
          <StatusUpdateConfirmation
            mountUnmount={isModalOpen}
            setMountUnmount={setIsModalOpen}
            setStatusState={setApplicationStatus}
            // Passing the fresh status variable onward directly
            confirmHandler={(decision) => handleUpdateDecisions(decision)}
            popupTitle={`Evaluate ${selectedAthlete?.playerName || "Applicant"}`}
            popupDetails="This status configuration modifies workflow lifecycle states instantly."
          />

          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {playerName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <Phone size={12} className="text-slate-400" />{" "}
                      {contactNumber}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${statusStyles[formStatus] || statusStyles.APPLIED}`}
                >
                  {formStatus}
                </span>
              </div>

              <hr className="border-slate-100 my-3" />

              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs mb-4">
                <div>
                  <p className="text-slate-400 font-medium">Age Group</p>
                  <p className="text-slate-800 mt-0.5 font-medium">
                    {category}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Sport / Position</p>
                  <p className="text-slate-800 mt-0.5 font-medium">
                    {sports} ({position})
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 font-medium">
                    Competition Applied
                  </p>
                  <p className="text-slate-800 mt-0.5 font-medium flex items-center gap-1.5">
                    <Award size={14} className="text-slate-500" />{" "}
                    {competitionName}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              {athlete.formStatus === "APPLIED" ? (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(athlete)}
                  className="flex items-center justify-center gap-2 text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg py-2 transition-colors"
                >
                  <CheckCircle size={14} className="text-emerald-600" />{" "}
                  Response
                </button>
              ) : null}

              <Link
                to={`/athlete-data-preview/${athlete.id}`}
                className="flex items-center justify-center gap-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 transition-colors"
              >
                <Eye size={14} /> View Full Data
              </Link>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
