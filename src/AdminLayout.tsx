import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { SidebarProvider } from "./context/SidebarContext";
import { useInactivityLogout } from "./hooks/useInactivityLogout";

const AdminLayout = () => {
  useInactivityLogout();
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 text-gray-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
