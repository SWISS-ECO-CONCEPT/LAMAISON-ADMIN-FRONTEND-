import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/auth/signIn";
// import Users from "./pages/Users";
// import Annonces from "./pages/Annonces";
// import RendezVous from "./pages/RendezVous";
// import Messages from "./pages/Messages";
// import Settings from "./pages/Settings";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/auth/signin" />} />
        <Route path="/admin/auth/signin" element={<SignIn />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            {/* <Route path="utilisateurs" element={<Users />} />
            <Route path="annonces" element={<Annonces />} />
            <Route path="rendezvous" element={<RendezVous />} />
            <Route path="messages" element={<Messages />} />
            <Route path="parametres" element={<Settings />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
