import { useEffect, useRef } from "react";
import { Menu, BellDot, UserPen } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";
import { ThemeToggleButton } from "../ThemToggleButton";
import LoginButton from "../Buttons/LoginButton";

export default function Header() {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-md"
      style={{
        backgroundColor: "rgba(58, 60, 68, 0.92)",
        borderColor: "rgba(245, 245, 245, 0.1)",
        color: "#f5f5f5",
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 lg:px-6">
        {/* Left — sidebar toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
            style={{
              border: "1px solid rgba(245, 245, 245, 0.15)",
              color: "#f5f5f5",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(245, 245, 245, 0.08)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Center — reserved slot */}
        <div className="hidden lg:block" />

        {/* Right — actions */}
        <div className="flex items-center gap-3">
          <ThemeToggleButton />

          {[BellDot, UserPen].map((Icon, i) => (
            <span
              key={i}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-colors"
              style={{
                border: "1px solid rgba(245, 245, 245, 0.15)",
                color: "#f5f5f5",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(245, 245, 245, 0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Icon className="h-5 w-5" />
            </span>
          ))}

          <LoginButton />
        </div>
      </div>
    </header>
  );
}
