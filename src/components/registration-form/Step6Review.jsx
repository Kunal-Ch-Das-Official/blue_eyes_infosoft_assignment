import { useAthleteRegistrationStore } from "../../stores/useRegistrationStore";

const Step6Review = () => {
  const store = useAthleteRegistrationStore();

  const renderSectionHeader = (title) => (
    <div className="border-b border-gray-100 pb-2 mb-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
        {title}
      </h3>
    </div>
  );

  const renderDataField = (label, value) => (
    <div className="space-y-1">
      <span className="text-xs text-gray-400 block font-medium">{label}</span>
      <span className="text-sm text-gray-800 font-semibold">
        {value || "—"}
      </span>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Step Heading */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Review Application
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Please double-check all information before completing your
          registration.
        </p>
      </div>

      {/* Profile Image & Core Info Banner */}
      <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col sm:flex-row gap-6 items-center">
        <div className="w-24 h-24 bg-white border border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm shrink-0">
          {store.profilePhoto ? (
            <img
              src={URL.createObjectURL(store.profilePhoto)}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase text-center p-2">
              No Photo Provided
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-center sm:text-left">
          {renderDataField("Athlete Full Name", store.playerName)}
          {renderDataField("Primary Contact Email", store.emailAddress)}
        </div>
      </div>

      {/* Grid Content Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal & Family Information Block */}
        <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
          {renderSectionHeader("Personal & Family Details")}
          <div className="grid grid-cols-2 gap-4">
            {renderDataField("Gender Selection", store.gender)}
            {renderDataField(
              "Date of Birth",
              store.dateOfBirth
                ? new Date(store.dateOfBirth).toLocaleDateString()
                : "",
            )}
            {renderDataField("Father's Name", store.fathersName)}
            {renderDataField("Mother's Name", store.mothersName)}
            <div className="col-span-2">
              {renderDataField("Primary Mobile No.", store.contactNumber)}
            </div>
            <div className="col-span-2">
              {renderDataField("Alternate Mobile No.", store.alternateMobileNo)}
            </div>
          </div>
        </div>

        {/* Home Address Metadata Block */}
        <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
          {renderSectionHeader("Residential Address")}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              {renderDataField("Street Address", store.address)}
            </div>
            {renderDataField("Pin / Postal Code", store.pinCode)}
            {renderDataField("State / Province", store.stateOrProvince)}
            <div className="col-span-2">
              {renderDataField("Country Code", store.country)}
            </div>
          </div>
        </div>
      </div>

      {/* Sports & Competitive Track Log Entries */}
      <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
        {renderSectionHeader("Sports & Team Affiliations")}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {renderDataField("Declared Academy / Club", store.club)}
          {renderDataField("Primary Core Discipline", store.sports)}
        </div>

        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Logged Tournament Records
        </h4>
        {store.competitions.length === 0 ? (
          <p className="text-xs text-gray-400 italic">
            No historical competition records logged.
          </p>
        ) : (
          <div className="space-y-3">
            {store.competitions.map((comp, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs grid grid-cols-2 md:grid-cols-4 gap-2"
              >
                <div>
                  <span className="text-gray-400 block">Name:</span>{" "}
                  <strong className="text-gray-700">
                    {comp.competitionName}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-400 block">Event:</span>{" "}
                  <strong className="text-gray-700">{comp.sports}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block">Category:</span>{" "}
                  <strong className="text-gray-700">
                    {comp.category || "—"}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-400 block">Position:</span>{" "}
                  <strong className="text-gray-700">
                    {comp.position || "—"}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Attachments File System Review */}
      <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
        {renderSectionHeader("Uploaded Document Summary")}
        {store.playerDocuments.length === 0 ? (
          <p className="text-xs text-gray-400 italic">
            No verification sheets attached to this profile.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {store.playerDocuments.map((doc, idx) => (
              <div
                key={idx}
                className="py-3 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="font-semibold text-gray-700">
                    {store.fileTitles[idx] || `Document #${idx + 1}`}
                  </span>
                </div>
                <span className="text-gray-400 font-mono">
                  {doc
                    ? `${(doc.size / (1024 * 1024)).toFixed(2)} MB`
                    : "Missing Attachment File"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Step6Review;
