import { Navigate } from "react-router-dom";
import { AuthValidator } from "../AuthValidator";
import PrivateWeb from "./PrivateWeb";

const ProtectedRoute = () => {
  const isAuthenticated = AuthValidator();

  return !isAuthenticated ? <Navigate to="/sign-in" /> : <PrivateWeb />;
};

export default ProtectedRoute;
