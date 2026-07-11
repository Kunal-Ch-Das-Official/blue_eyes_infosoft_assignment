import { useState, useEffect, useCallback } from "react";
import { AlertTriangle, Loader2, RefreshCw, LayoutGrid } from "lucide-react";
import { toast } from "react-toastify";
import apiUrl from "../../config/api.conf";
import envConfig from "../../config/env.conf";
import AthleteCard from "./AthleteCard";

export default function AthleteRegistryGrid() {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core fetch execution logic
  const fetchAthletesData = useCallback(async () => {
    setLoading(true);
    setError(null);
      try {
        setLoading(true);
        const response = await apiUrl.get(envConfig.FETCH_PLAYERS_DETAILS_URL, {
          withCredentials: true,
        });

        if (!response.data) {
          return toast.error(
            <div>
              <strong className="text-rose-600">Failed!</strong>
              <p className="text-xs text-gray-800">
                Something went wrong! Response were not coming. Please try
                again.
              </p>
            </div>,
          );
        } else {
          setAthletes(response.data);
        }
      } catch (error) {
        return toast.error(
          <div>
            <strong className="text-rose-600">Failed.</strong>
            <p className="text-xs text-gray-800">
              {error.message} || Something went wrong! Response were not coming.
              Please try again.
            </p>
          </div>,
        );
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    const fetchCall = async () => {
      await fetchAthletesData();
    };
    fetchCall();
  }, [fetchAthletesData]);

  // Action callback stubs
  const handleUpdateStatus = (athlete) => {
    alert(`Status modal hook activated for: ${athlete.playerName}`);
  };

  // --- LOADING FALLBACK (Premium Skeleton Look) ---
  if (loading) {
    return (
      <div className="w-full min-h-100 flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="animate-spin text-indigo-500" size={36} />
        <p className="text-sm tracking-wide animate-pulse">
          Querying cloud data matrices...
        </p>
      </div>
    );
  }

  // --- ERROR HANDLER VIEW ---
  if (error) {
    return (
      <div className="w-full max-w-xl mx-auto my-12 p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex flex-col items-center text-center gap-4">
        <div className="p-3 bg-rose-500/10 text-rose-400 rounded-full">
          <AlertTriangle size={28} />
        </div>
        <div>
          <h4 className="text-white font-semibold mb-1">
            Database Retrieval Interrupted
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
        </div>
        <button
          onClick={fetchAthletesData}
          className="flex items-center gap-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 px-4 py-2 rounded-xl transition-all"
        >
          <RefreshCw size={14} /> Retry Handshake
        </button>
      </div>
    );
  }

  // --- EMPTY STATE FALLBACK ---
  if (!athletes || athletes.length === 0) {
    return (
      <div className="w-full text-center py-20 border border-dashed border-slate-900 rounded-2xl text-slate-500">
        <LayoutGrid size={32} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">
          Zero records match current registered parameters.
        </p>
      </div>
    );
  }

  // --- RENDER SUCCESS GRID ---
  return (
    <div className="space-y-6">
      {/* Title Count Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-500">
          Live Roster Profiles ({athletes.length})
        </span>
        <button
          onClick={fetchAthletesData}
          className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 rounded-xl transition-colors"
          title="Refresh Feed"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Grid Container */}
      <div className="mt-20 mx-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {athletes.map((athlete, index) => (
          <AthleteCard
            key={athlete?.competitionPlayed?.[0]?.id || index}
            athlete={athlete}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
}
