import { useState, useEffect, useCallback, useMemo } from "react";
import {
  AlertTriangle,
  Loader2,
  RefreshCw,
  LayoutGrid,
  Search,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "react-toastify";
import apiUrl from "../../config/api.conf";
import envConfig from "../../config/env.conf";
import AthleteCard from "./AthleteCard";

export default function AthleteRegistryGrid() {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isStatusChanged, setIsStatusChanged] = useState(false)

  // Core fetch execution logic
  const fetchAthletesData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUrl.get(envConfig.FETCH_PLAYERS_DETAILS_URL, {
        withCredentials: true,
      });

      if (!response.data) {
        const fallbackMsg = "Something went wrong! Response was empty.";
        setError(fallbackMsg);
        toast.error(
          <div>
            <strong className="text-rose-600">Failed!</strong>
            <p className="text-xs text-gray-800">
              {fallbackMsg} Please try again.
            </p>
          </div>,
        );
      } else {
        setAthletes(response.data);
      }
    } catch (err) {
      const errMsg =
        err.message || "Something went wrong! Response were not coming.";
      setError(errMsg);
      toast.error(
        <div>
          <strong className="text-rose-600">Failed.</strong>
          <p className="text-xs text-gray-800">{errMsg} Please try again.</p>
        </div>,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initFetchCall = async () => await fetchAthletesData();
    initFetchCall();
  }, [fetchAthletesData, isStatusChanged]);

  // Operational Search Filter logic
  const filteredAthletes = useMemo(() => {
    if (!searchQuery.trim()) return athletes;
    return athletes.filter(
      (athlete) =>
        athlete?.playerName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        athlete?.formStatus
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        athlete?.contactNumber
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        athlete?.currentAge?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [athletes, searchQuery]);


  const handleExportExcel = () => {
    toast.info("Initializing XLSX export matrix...");
    // Future integration: use 'xlsx' package to download filteredAthletes data
    console.log("Exporting data to Excel...", filteredAthletes);
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

  // --- RENDER SUCCESS GRID ---
  return (
    <div className="space-y-6 px-8 py-6 mt-20">
      {/* Premium Controls Toolbar */}
      <div
        className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between
      border-b border-slate-300/60 pb-6"
      >
        {/* Search Bar (Top Left) */}
        <div className="relative max-w-md w-full group">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 
            group-focus-within:text-indigo-400 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search roster by athlete name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white hover:bg-slate-50 border
             border-slate-300 focus:border-indigo-500/50 text-slate-800 placeholder-slate-500 text-sm pl-11 pr-4 py-2.5 rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>

        {/* Action Controls (Top Right) */}
        <div className="flex items-center justify-end gap-3 self-end sm:self-auto">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 text-xs font-medium
             bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 border border-green-500/20 px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-emerald-950/20"
          >
            <FileSpreadsheet size={16} /> Export Data XLSX
          </button>

          <button
            onClick={fetchAthletesData}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 rounded-xl transition-colors"
            title="Refresh Feed"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Meta Counter Label */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm font-bold tracking-widest text-slate-500">
          Live Roster Profiles ({filteredAthletes.length})
        </span>
      </div>

      {/* Empty State Fallback (Now responds conditionally to filtering too) */}
      {filteredAthletes.length === 0 ? (
        <div className="w-full text-center py-20 border border-dashed border-slate-800 rounded-2xl text-slate-500">
          <LayoutGrid size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            Zero records match current registered parameters.
          </p>
        </div>
      ) : (
        /* Grid Container */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAthletes.map((athlete, index) => (
            <AthleteCard
              key={athlete?.competitionPlayed?.[0]?.id || index}
              athlete={athlete}
              setIsStatusChanged={setIsStatusChanged}
            />
          ))}
        </div>
      )}
    </div>
  );
}
