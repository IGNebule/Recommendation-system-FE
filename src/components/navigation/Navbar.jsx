import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Discover", path: "/discover" },
  { label: "About", path: "/about" },
  { label: "Support", path: "/support" },
];

const BellIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 0 1-6 0"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 21a8 8 0 1 0-16 0"
    />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L4.2 7A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3h.1A1.7 1.7 0 0 0 10 3.1V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1A1.7 1.7 0 0 0 20.9 10h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12H3m0 0 4-4m-4 4 4 4"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9"
    />
  </svg>
);

const Navbar = ({ isScrolled = false }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { user, logout } = useAuth();
  const isLoggedIn = Boolean(user);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`w-full bg-[#171a21] transition-all duration-300 ease-in-out ${
        isScrolled
          ? "h-0 -translate-y-full opacity-0"
          : "h-[72px] translate-y-0 opacity-100"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1260px] items-center justify-between px-4">
        {/* Left: Logo + main links */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg font-black text-[#171a21]">
              G
            </div>

            <span className="text-xl font-black uppercase tracking-[0.18em] text-white/90">
              GameRec
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  [
                    "relative py-2 text-sm font-bold uppercase tracking-wide transition",
                    "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:rounded-full after:transition-all after:duration-200",
                    isActive
                      ? "text-[#7C3AED] after:w-full after:bg-[#7C3AED]"
                      : "text-white/75 after:w-0 after:bg-[#7C3AED] hover:text-[#7C3AED] hover:after:w-full",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right: auth area */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Notifications"
          >
            <BellIcon />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {isLoggedIn ? (
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded bg-white/5 px-2 py-1.5 text-white transition hover:bg-white/10"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#7C3AED] text-sm font-black text-[#171a21]">
                  {user?.name?.charAt(0)?.toUpperCase() ||
                    user?.email?.charAt(0)?.toUpperCase() ||
                    "U"}
                </div>

                <span className="hidden max-w-32 truncate text-sm font-medium text-white/80 sm:block">
                  {user?.name || user?.email || "User"}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute z-50 right-0 mt-3 w-56 overflow-hidden rounded border border-white/10 bg-[#171a21] shadow-2xl">
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                  >
                    <UserIcon />
                    Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                  >
                    <SettingsIcon />
                    Settings
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    <LogoutIcon />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded bg-[#75a313] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#8bc53f]"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
