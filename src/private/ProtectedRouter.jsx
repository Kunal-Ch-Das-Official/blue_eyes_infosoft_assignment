import { Navigate } from "react-router-dom";
import PrivateWeb from "./PrivateWeb";
import { useAuthValidator } from "../hooks/useAuthValidator";

const ProtectedRoute = () => {
  const { loading, authenticated } = useAuthValidator();
  
  if (loading === true) return null;
  return authenticated === true ? <PrivateWeb /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
