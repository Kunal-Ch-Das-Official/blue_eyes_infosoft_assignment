import { useAthleteRegistrationStore } from "../../stores/useRegistrationStore";
import TextInput from "../../utils/form-inputs/TextInput";

const Step4Sports = () => {
  const {
    club,
    sports,
    competitions,
    updateField,
    addCompetition,
    updateCompetition,
    removeCompetition,
  } = useAthleteRegistrationStore();

  const handleAddCompetition = () => {
    if (competitions.length < 10) {
      addCompetition({
        competitionName: "",
        sports: "",
        category: "",
        position: "",
      });
    }
  };

  const handleCompetitionUpdate = (index, field, value) => {
    const updatedRecord = {
      ...competitions[index],
      [field]: value,
    };
    updateCompetition(index, updatedRecord);
  };

  return (
    <div className="space-y-8">
      {/* Primary Sports Section */}
      <div className="space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Sports Affiliation
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Specify your current athletic club and primary sporting event
            tracking parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            inputLabel="Current Club Name"
            fieldId="club"
            values={club}
            placeHolderText="Enter affiliated academy or club"
            isRequired={true}
            textValue={(val) => updateField("club", val)}
          />

          <TextInput
            inputLabel="Primary Sport"
            fieldId="sports"
            values={sports}
            placeHolderText="e.g., Athletics, Football"
            isRequired={true}
            textValue={(val) => updateField("sports", val)}
          />
        </div>
      </div>

      {/* Dynamic Competitions Log Array Section */}
      <div className="space-y-6 pt-2">
        <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Competition History
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Log past matches, tournaments, or representative championships
              (Max 10).
            </p>
          </div>
          <button
            type="button"
            disabled={competitions.length >= 10}
            onClick={handleAddCompetition}
            className={`self-start sm:self-auto px-4 py-2 text-xs font-semibold rounded-xl tracking-wide transition-all ${
              competitions.length >= 10
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-sky-50 text-sky-600 hover:bg-sky-100 shadow-sm border border-sky-100"
            }`}
          >
            + Add Competition
          </button>
        </div>

        {competitions.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <p className="text-sm text-gray-400 font-medium">
              No competition details logged yet. Click add to declare historical
              milestones.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {competitions.map((comp, index) => (
              <div
                key={index}
                className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm relative group transition-all hover:border-sky-200"
              >
                {/* Header info badge and Delete action */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">
                    Record Entry #{index + 1}
                  </span>

                  {/* Protect the zero index element based on guidelines */}

                    <button
                      type="button"
                      onClick={() => removeCompetition(index)}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Delete
                    </button>

                </div>

                {/* Internal layout properties */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextInput
                    inputLabel="Competition Name"
                    fieldId={`compName-${index}`}
                    values={comp.competitionName}
                    placeHolderText="e.g., National Under-19 Championship"
                    isRequired={true}
                    textValue={(val) =>
                      handleCompetitionUpdate(index, "competitionName", val)
                    }
                  />

                  <TextInput
                    inputLabel="Sport Segment"
                    fieldId={`compSport-${index}`}
                    values={comp.sports}
                    placeHolderText="e.g., 100m Sprint, Winger"
                    isRequired={true}
                    textValue={(val) =>
                      handleCompetitionUpdate(index, "sports", val)
                    }
                  />

                  <TextInput
                    inputLabel="Category / Weight Class"
                    fieldId={`compCat-${index}`}
                    values={comp.category}
                    placeHolderText="e.g., Under-19, 75kg Heavyweight"
                    isRequired={false}
                    textValue={(val) =>
                      handleCompetitionUpdate(index, "category", val)
                    }
                  />

                  <TextInput
                    inputLabel="Position / Achievement"
                    fieldId={`compPos-${index}`}
                    values={comp.position}
                    placeHolderText="e.g., Gold Medalist, Finalist"
                    isRequired={false}
                    textValue={(val) =>
                      handleCompetitionUpdate(index, "position", val)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Step4Sports;
