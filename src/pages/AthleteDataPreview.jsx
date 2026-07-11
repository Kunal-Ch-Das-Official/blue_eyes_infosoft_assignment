import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiUrl from "../config/api.conf";
import envConfig from "../config/env.conf";
import { toast } from "react-toastify";
import AthleteDetailsPreviewComp from "../components/access-details/AthleteDetailsPreviewComp";

const AthleteDataPreview = () => {
  const { dataId } = useParams();
  const [loading, setLoading] = useState(false);
  const [athleteDataPreview, setAthleteDataPreview] = useState([]);

  const fetchAthletesData = useCallback(async () => {
    setLoading(true);
    try {
      setLoading(true);
      const response = await apiUrl.get(
        `${envConfig.FETCH_PLAYERS_DETAILS_URL}/${dataId}`,
        {
          withCredentials: true,
        },
      );

      if (!response.data) {
        return toast.error(
          <div>
            <strong className="text-rose-600">Failed!</strong>
            <p className="text-xs text-gray-800">
              Something went wrong! Response were not coming. Please try again.
            </p>
          </div>,
        );
      } else {
        setAthleteDataPreview(response.data);
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

  return (
    <>
      {loading === true ? (
        <p>Loading...</p>
      ) : (
     <div className="min-h-screen mt-20">
         <AthleteDetailsPreviewComp playerData={athleteDataPreview} />
     </div>
      )}
    </>
  );
};

export default AthleteDataPreview;
