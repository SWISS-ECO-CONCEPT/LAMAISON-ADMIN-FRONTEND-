import { Menu } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

const Header = () => {
  const { toggleSidebar } = useSidebar();
  const role = localStorage.getItem("role") || undefined

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* Bouton burger pour mobile */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Admin</span>
        <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
          {role ? role.charAt(0).toUpperCase() : 'A'}
        </div>
      </div>
    </header>
  );
};

export default Header;
