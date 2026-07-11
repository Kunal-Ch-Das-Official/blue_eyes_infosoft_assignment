import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./private/ProtectedRouter";
import AdminMailVerification from "./pages/AdminMailVerification";
import AdminDashboard from "./pages/AdminDashboard";
import AthleteDataPreview from "./pages/AthleteDataPreview";

function App() {
  return (
    <Routes>

      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/verify-new-admin-email/:emailId" element={<AdminMailVerification />} />


      <Route path="/sign-in" element={<SignIn />} />


      <Route element={<ProtectedRoute />}>
        <Route index element={<AdminDashboard />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/athlete-data-preview/:dataId" element={<AthleteDataPreview />} />
      </Route>
    </Routes>
  );
}

export default App;