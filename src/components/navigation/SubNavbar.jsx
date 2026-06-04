import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

const subLinks = [
  { label: "Library", path: "/preferences" },
  { label: "Categories", path: "/categories" },
  { label: "Reviews", path: "/reviews" },
];

const SearchIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
    />
  </svg>
);

const SubNavbar = ({ isScrolled = false }) => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = query.trim();

    if (!trimmed) return;

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setQuery("");
  };

  return (
    <div
      className={`w-full bg-gradient-to-r from-[#1d1830]/90 via-[#161224]/90 to-[#020105]/90 transition-all duration-300 ease-in-out ${
        isScrolled ? "shadow-[0_8px_24px_rgba(0,0,0,0.35)]" : ""
      }`}
    >
      <div className="mx-auto max-w-[1260px] px-4 ">
        <div
          className={`flex min-h-[48px] items-center justify-between gap-4 px-4 transition-all duration-300 ${
            isScrolled ? "rounded-none" : ""
          }`}
        >
          {/* Left links */}
          <nav className="flex items-center gap-1">
            {subLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  [
                    "relative px-4 py-3 text-sm font-semibold text-white/80 transition",
                    "hover:bg-white/10 hover:text-white",
                    isActive ? "bg-white/10 text-white" : "text-white/70",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right search */}
          <form
            onSubmit={handleSubmit}
            className="hidden w-full max-w-md items-center md:flex"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the store"
              className="h-9 flex-1 border border-[#2D2643] bg-transparent px-4 text-sm italic text-white outline-none placeholder:text-[#9CA3AF] focus:border-[#7C3AED]"
            />

            <button
              type="submit"
              className="flex h-9 w-11 items-center justify-center bg-[#7C3AED] text-white transition hover:bg-[#7cccf5]"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubNavbar;
