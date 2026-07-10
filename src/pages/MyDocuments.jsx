import { useEffect, useState } from "react";
import apiUrl from "../config/api.conf";
import envConfig from "../config/env.conf";
import MyDocumentsComp from "../components/own-documents/MyDocumentsComp";
import { toast } from "react-toastify";

const MyDocuments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submittedDocument, setSubmittedDocument] = useState([]);

  useEffect(() => {
    const fetchOwnSubmittedData = async () => {
      try {
        setIsLoading(true);
        const response = await apiUrl.get(
          `${envConfig.FETCH_OWN_SUBMITTED_DOCS_URL}`,
          { withCredentials: true },
        );

        if (!response || !response.data) {
          toast.error(
            <div>
              <strong className="text-rose-600">Failed!</strong>
              <p className="text-xs text-gray-800">
                Empty response body returned from server.
              </p>
            </div>,
          );
        } else {
          // Guarantee that we are working with an array structure
          const data = Array.isArray(response.data)
            ? response.data
            : [response.data];
          setSubmittedDocument(data);
        }
      } catch (error) {
        toast.error(
          <div>
            <strong className="text-rose-600">Failed!</strong>
            <p className="text-xs text-gray-800">
              {error.message || "Something went wrong."}
            </p>
          </div>,
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchOwnSubmittedData();
  }, []);

  return (
    <main className="mt-20">
      {isLoading && (
        <div className="text-center font-medium text-zinc-500 py-12 text-sm tracking-wide">
          Loading player profiles...
        </div>
      )}

      {!isLoading && submittedDocument.length === 0 && (
        <div className="text-center font-medium text-zinc-400 py-12 text-sm">
          No records found.
        </div>
      )}

      {!isLoading &&
        submittedDocument.map((data, index) => (
          <MyDocumentsComp
            key={data?.id || `player-card-${index}`}
            playerData={data}
          />
        ))}
    </main>
  );
};

export default MyDocuments;
