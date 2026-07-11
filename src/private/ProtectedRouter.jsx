import { Navigate } from "react-router-dom";
import { useAuthValidator } from "../hooks/useAuthValidator";
import PrivateDashboard from "./PrivateDashboard";

const ProtectedRoute = () => {
  const { loading, authenticated } = useAuthValidator();

  console.log("loading", loading);
  console.log("auth", authenticated)
  
  if (loading === true) return null;
  return authenticated === true ? <PrivateDashboard /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
