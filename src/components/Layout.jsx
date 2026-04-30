import { Outlet } from "react-router-dom";
import Sidebar from "./layout/SideBar";
import Header from "./layout/Header";
import { useSidebar } from "../context/SidebarContext";

export default function Layout() {
  const { isExpanded } = useSidebar();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#081028]">
      <Sidebar />

      <div
        className={`transition-all duration-300 ${
          isExpanded ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
