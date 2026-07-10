import axios from "axios";
import { toast } from "react-toastify";

const InternalErrorRes = (error) => {
  if (axios.isAxiosError(error)) {
    toast.error(
      <div>
        <strong className="text-rose-600">
          {error.response?.data?.message || "Internal Server Error!"}
        </strong>
        <p className="text-xs text-gray-500">
          {error.response?.data?.details ||
            "An unexpected error occurred, Please try again. If not resolved contact to support."}
        </p>
      </div>,
    );
  } else {
    toast.error(
      <div>
        <strong className="text-rose-600">Failed!</strong>
        <p className="text-xs text-gray-500">{error.message}</p>
      </div>,
    );
  }
};

export default InternalErrorRes;
