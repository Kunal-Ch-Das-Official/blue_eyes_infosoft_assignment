import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Shield,
  FileText,
  CheckCircle2,
} from "lucide-react";

const AthleteDetailsPreviewComp = ({ playerData }) => {
  // If no player data is provided at all, return a graceful fallback state instead of crashing
  if (!playerData) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white border border-zinc-200 rounded-2xl text-center text-zinc-400 font-medium text-sm">
        No player profile information available.
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-700 font-medium antialiased p-6 md:p-12 selection:bg-emerald-100">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Premium Header / Hero Banner */}
        <div className="relative overflow-hidden bg-white border border-zinc-200/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Avatar Container */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-15 group-hover:opacity-25 transition duration-350" />
            <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
              <img
                src={playerData.playersPhotoUrl || ""}
                alt={playerData.playerName || "Player Profile"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=300&auto=format&fit=crop";
                }}
              />
            </div>
          </div>

          {/* Core Bio Info */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="text-xs tracking-wider uppercase px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                {playerData.club || "No Club"}
              </span>
              <span className="text-xs tracking-wider uppercase px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-500 border border-zinc-200">
                {playerData.sports || "N/A"}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl text-zinc-900 tracking-tight font-medium">
              {playerData.playerName || "Anonymous Player"}
            </h1>

            <p className="text-zinc-500 text-sm flex items-center justify-center md:justify-start gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Player ID:{" "}
              <span className="text-zinc-600 font-mono text-xs">
                {playerData.id ? `${playerData.id.slice(0, 8)}...` : "N/A"}
              </span>
            </p>
          </div>
        </div>

        {/* Content Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Personal & Family Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 space-y-6 shadow-sm">
              <h2 className="text-sm tracking-wider uppercase text-emerald-600 flex items-center gap-2">
                <User className="w-4 h-4" /> Personal Profile
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div className="space-y-1">
                  <p className="text-zinc-400">Date of Birth</p>
                  <p className="text-zinc-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    {formatDate(playerData.dateOfBirth)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-400">Current Age / Gender</p>
                  <p className="text-zinc-800">
                    {playerData.currentAge || "N/A"} Years{" "}
                    <span className="text-zinc-300 mx-1.5">•</span>{" "}
                    {playerData.gender || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-400">Father's Name</p>
                  <p className="text-zinc-800">
                    {playerData.fathersName || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-400">Mother's Name</p>
                  <p className="text-zinc-800">
                    {playerData.mothersName || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 space-y-6 shadow-sm">
              <h2 className="text-sm tracking-wider uppercase text-emerald-600 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Contact & Logistics
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-zinc-400">Email Address</p>
                  <p className="text-zinc-800 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-zinc-400" />
                    {playerData.emailAddress || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-400">Primary Contact</p>
                  <p className="text-zinc-800 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-zinc-400" />
                    {playerData.contactNumber || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-400">Alternate Contact</p>
                  <p className="text-zinc-800 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-zinc-400" />
                    {playerData.alternateMobileNo || "N/A"}
                  </p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-zinc-400">Residential Address</p>
                  <p className="text-zinc-800 flex items-start gap-2 leading-relaxed whitespace-pre-line">
                    <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                    {playerData.address || "No address listed"}
                    {playerData.stateOrProvince
                      ? `, ${playerData.stateOrProvince}`
                      : ""}
                    {playerData.country ? `, ${playerData.country}` : ""}
                    {playerData.pinCode ? ` - ${playerData.pinCode}` : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Performance & Documents */}
          <div className="space-y-6">
            {/* Competition Played */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="text-sm tracking-wider uppercase text-emerald-600 flex items-center gap-2">
                <Award className="w-4 h-4" /> Competitions
              </h2>

              {playerData.competitionPlayed &&
              playerData.competitionPlayed.length > 0 ? (
                playerData.competitionPlayed.map((comp, index) => (
                  <div
                    key={comp.id || `player-card-${index}`}
                    className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl space-y-3"
                  >
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider">
                        {comp.sports || "N/A"} • {comp.category || "N/A"}
                      </p>
                      <p className="text-zinc-900 text-sm mt-0.5">
                        {comp.competitionName || "Unnamed Tournament"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-200/80 pt-2.5 text-xs">
                      <span className="text-zinc-500">Position</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-mono">
                        {comp.position || "N/A"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 py-2 text-center">
                  No competitions listed.
                </p>
              )}
            </div>

            {/* Player Documents */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="text-sm tracking-wider uppercase text-emerald-600 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Verified Records
              </h2>

              {playerData.playerDocuments &&
              playerData.playerDocuments.length > 0 ? (
                playerData.playerDocuments.map((doc, index) => (
                  <a
                    href={doc.documentUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    key={doc.id || `document-card-${index}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-white border border-zinc-200 text-zinc-400 group-hover:text-emerald-600 transition shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-xs text-zinc-900 truncate max-w-35 font-medium">
                          {doc.documentName || "Unnamed Document"}
                        </p>
                        <p className="text-[11px] text-zinc-400 uppercase mt-0.5">
                          {formatBytes(doc.documentSize)}
                        </p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                  </a>
                ))
              ) : (
                <p className="text-xs text-zinc-400 py-2 text-center">
                  No documents uploaded.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AthleteDetailsPreviewComp
