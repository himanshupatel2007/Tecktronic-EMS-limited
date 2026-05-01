import {
  LayoutDashboard,
  CircleUserRound,
  Building2,
  Cpu,
  Users,
  LogIn,
  Package,
  ClipboardList,
  Boxes,
  Warehouse,
  Factory,
  Cog,
  Truck,
  Calculator,
  ShieldCheck,
  BookUser,
  X,
  IndianRupeeIcon,
  History,
} from "lucide-react";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(null);
  const { isExpanded, isMobileOpen, closeMobileSidebar } = useSidebar();

  const sidebarItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },

    {
      name: "Manage Users",
      icon: CircleUserRound,
      children: [
        { name: "Admins", href: "/manage-users/admins" },
        { name: "Team", href: "/manage-users/team" },
      ],
    },

    { name: "Departments", href: "/departments", icon: Building2 },

    {
      name: "Customers",
      icon: Users,
      children: [
        { name: "Customers List", href: "/customers/list" },
        { name: "Quotations", href: "/customers/quotations" },
        { name: "Customer P.O.", href: "/customers/po" },
        { name: "Sales Invoicing", href: "/customers/invoicing" },
        { name: "Return Inwards", href: "/customers/returns-inwards" },
        { name: "Summary", href: "/customers/summary" },
      ],
    },

    {
      name: "Suppliers",
      icon: Truck,
      children: [
        { name: "Suppliers List", href: "/suppliers/list" },
        { name: "Purchase Orders", href: "/suppliers/purchase-orders" },
        { name: "Purchases", href: "/suppliers/purchases" },
        { name: "Return Outwards", href: "/suppliers/returns-outwards" },
        { name: "Summary", href: "/suppliers/summary" },
      ],
    },

    {
      name: "Gate Entry",
      icon: LogIn,
      children: [
        { name: "Create GRN", href: "/gate-entry/grn" },
        { name: "Stock Allocation", href: "/gate-entry/stock-allocation" },
        { name: "Quality Control", href: "/gate-entry/quality-control" },
      ],
    },

    {
      name: "Products",
      icon: Package,
      children: [
        { name: "Product List", href: "/products/list" },
        { name: "Product Groups", href: "/products/groups" },
        { name: "HSN Groups", href: "/products/hsn-groups" },
      ],
    },

    {
      name: "BOM",
      icon: ClipboardList,
      children: [
        { name: "BOM Groups", href: "/bom/groups" },
        { name: "Manage BOM", href: "/bom/manage" },
      ],
    },

    { name: "Godowns", href: "/godowns", icon: Warehouse },

    {
      name: "Inventory",
      icon: Boxes,
      children: [
        { name: "Inventory Management", href: "/inventory/manage" },
        { name: "Production Stock", href: "/inventory/production-stock" },
        { name: "Raw Material Stock", href: "/inventory/raw-stock" },
      ],
    },

    { name: "SMT Store", href: "/smt-store", icon: Cpu },

    {
      name: "Assembly Line",
      icon: Factory,
      children: [
        { name: "Manage Lines", href: "/assembly-line/manage" },
        { name: "Production", href: "/assembly-line/production" },
        {
          name: "Raw Material History",
          href: "/assembly-line/material-history",
        },
      ],
    },

    { name: "Production", href: "/production", icon: Cog },

    {
      name: "Production Calculator",
      href: "/production/calculator",
      icon: Calculator,
    },

    { name: "Dispatch", href: "/dispatch", icon: Truck },

    {
      name: "Quality Control",
      icon: ShieldCheck,
      children: [
        { name: "Checklist Groups", href: "/quality/checklist-groups" },
        { name: "Checklists", href: "/quality/checklists" },
        { name: "History", href: "/quality/history" },
      ],
    },

    {
      name: "Logs & History",
      icon: History,
      children: [
        { name: "Transactions", href: "/logs/transactions" },
        { name: "Login History", href: "/logs/login-history" },
        { name: "Software Trail", href: "/logs/software-trail" },
      ],
    },

    {
      name: "Cash & Banks",
      icon: IndianRupeeIcon,
      children: [
        { name: "Cash Book", href: "/transactions/cash-book" },
        { name: "Bank Book", href: "/transactions/bank-book" },
        { name: "Manage Banks", href: "/transactions/manage-banks" },
      ],
    },
  ];

  // ✅ AUTO OPEN BASED ON ROUTE
  useEffect(() => {
    const activeMenu = sidebarItems.find((item) => {
      if (!item.children) return false;

      return item.children.some((child) =>
        location.pathname.startsWith(child.href),
      );
    });

    setOpenMenu(activeMenu ? activeMenu.name : null);
  }, [location.pathname]);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col
        border-r border-slate-300 bg-white dark:bg-[#081028]
        dark:border-[#162033] transition-all duration-300  dark:text-white
        ${isExpanded ? "w-64" : "w-20"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* HEADER */}
        <div
          className="flex items-center justify-between px-4 py-2 shrink-0"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <NavLink to="/" className="flex items-center gap-3 px-2 py-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#44a83e]">
              <BookUser className="h-5 w-5 text-white" />
            </div>

            {isExpanded && (
              <span className="text-[22px] font-semibold text-white">
                Admin Panel
              </span>
            )}
          </NavLink>

          <button onClick={closeMobileSidebar} className="lg:hidden text-white">
            <X />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const hasChildren = !!item.children;

              return (
                <li key={item.name}>
                  {/* MAIN ITEM */}
                  <div
                    onClick={() => {
                      if (hasChildren) {
                        const isOpening = openMenu !== item.name;

                        setOpenMenu(isOpening ? item.name : null);

                        // ✅ Navigate to first child ONLY when opening
                        if (isOpening && item.children?.length > 0) {
                          navigate(item.children[0].href);
                          closeMobileSidebar();
                        }
                      } else {
                        navigate(item.href);
                        closeMobileSidebar();
                      }
                    }}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition ${
                      location.pathname === item.href
                        ? "bg-[#ccf0ca] text-[#1a5c18]"
                        : "hover:bg-slate-100 dark:hover:bg-[#11182b]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      {isExpanded && <span>{item.name}</span>}
                    </div>

                    {hasChildren && isExpanded && (
                      <span className="text-xs">
                        {openMenu === item.name ? "▾" : "▸"}
                      </span>
                    )}
                  </div>

                  {/* CHILDREN */}
                  {hasChildren && openMenu === item.name && isExpanded && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <NavLink
                            to={child.href}
                            onClick={closeMobileSidebar}
                            className={({ isActive }) =>
                              `block rounded-lg px-3 py-2 text-sm ${
                                isActive
                                  ? "bg-[#ccf0ca] text-[#1a5c18]"
                                  : "hover:bg-slate-100 dark:hover:bg-[#11182b]"
                              }`
                            }
                          >
                            {child.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
