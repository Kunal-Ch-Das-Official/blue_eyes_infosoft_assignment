import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./private/ProtectedRouter";
import HomePage from "./pages/HomePage";
import NewUsersEmailVerification from "./pages/NewUsersEmailVerification";
import MyDocuments from "./pages/MyDocuments";

function App() {
  return (
    <Routes>

      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/verify-new-users-email/:emailId" element={<NewUsersEmailVerification />} />


      <Route path="/sign-in" element={<SignIn />} />


      <Route element={<ProtectedRoute />}>
        <Route index element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/my-document" element={<MyDocuments />} />
      </Route>
    </Routes>
  );
}

export default App;