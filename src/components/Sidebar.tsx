import { NavLink } from "react-router-dom";
import {
  Home, Users, Building2, Calendar, MessageSquare, Settings, LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useSidebar } from "../context/SidebarContext";
import logo from "../assets/logo.jpg";

const Sidebar = () => {
  const { isOpen, closeSidebar } = useSidebar();

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/admin/dashboard" },
    { name: "Utilisateurs", icon: Users, path: "/admin/utilisateurs" },
    { name: "Annonces", icon: Building2, path: "/admin/annonces" },
    { name: "Rendez-vous", icon: Calendar, path: "/admin/rendezvous" },
    { name: "Messages", icon: MessageSquare, path: "/admin/messages" },
    { name: "Paramètres", icon: Settings, path: "/admin/parametres" },
  ];

  return (
    <>
      {/* Version desktop */}
      <aside className="hidden md:flex w-64 bg-white shadow-md flex-col">
        <div className="p-4 border-b border-gray-200">
          <img src={logo} alt="logo" className="h-10 w-auto"/>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(({ name, icon: Icon, path }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-4 py-2 rounded-lg transition",
                  isActive
                    ? "bg-green-100 text-green-600 font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                )
              }
            >
              <Icon className="w-5 h-5" />
              {name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
            <LogOut className="w-5 h-5" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Version mobile (overlay) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay semi-transparent */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={closeSidebar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sidebar mobile */}
            <motion.aside
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 z-50 w-64 bg-white shadow-lg h-full flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                 <img src={logo} alt="logo" className="h-10 w-auto"/>
                {/* <button onClick={closeSidebar}>
                  <X className="w-6 h-6 text-gray-600" />
                </button> */}
              </div>

              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map(({ name, icon: Icon, path }) => (
                  <NavLink
                    key={name}
                    to={path}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center gap-3 px-4 py-2 rounded-lg transition",
                        isActive
                          ? "bg-blue-100 text-green-600 font-medium"
                          : "hover:bg-gray-100 text-gray-700"
                      )
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {name}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
