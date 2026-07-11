import { Eye, CheckCircle, Phone, Award, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function AthleteCard({
  athlete,
  onUpdateStatus,
}) {
  // Graceful Null / Structure Check
  if (!athlete) return null;

  // Extract core fields safely with fallback defaults
  const {
    playerName = "Unknown Athlete",
    contactNumber = "N/A",
    currentAge = "N/A",
    formStatus = "PENDING",
    competitionPlayed = [],
  } = athlete;

  // Safely grab the first competition array object if it exists
  const primaryComp = competitionPlayed[0] || {};
  const {
    category = `Age Group: ${currentAge}`,
    sports = "Unspecified Sport",
    competitionName = "No Active Application",
    position = "N/A",
  } = primaryComp;

  // Clean, flat status styling for a white background
  const statusStyles = {
    APPLIED: "bg-amber-50 text-amber-700 border-amber-200",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
      <div>
        {/* Card Header */}
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
                <Phone size={12} className="text-slate-400" /> {contactNumber}
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

        {/* Data Properties Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs mb-4">
          <div>
            <p className="text-slate-400 font-medium">Age Group</p>
            <p className="text-slate-800 mt-0.5 font-medium">{category}</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Sport / Position</p>
            <p className="text-slate-800 mt-0.5 font-medium">
              {sports} ({position})
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-slate-400 font-medium">Competition Applied</p>
            <p className="text-slate-800 mt-0.5 font-medium flex items-center gap-1.5">
              <Award size={14} className="text-slate-500" /> {competitionName}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onUpdateStatus?.(athlete)}
          className="flex items-center justify-center gap-2 text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg py-2 transition-colors"
        >
          <CheckCircle size={14} className="text-emerald-600" /> Response
        </button>
        <Link
          to={`/athlete-data-preview/${athlete.id}`}
          className="flex items-center justify-center gap-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 transition-colors"
        >
          <Eye size={14} /> View Full Data
        </Link>
      </div>
    </div>
  );
}
