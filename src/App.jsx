import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./private/ProtectedRouter";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />

      <Route element={<ProtectedRoute />}>
        <Route index element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;