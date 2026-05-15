import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Library", href: "/library" },
  { label: "Support", href: "/support" },
];

const SUB_NAV_LINKS = [
  { label: "Browse", href: "/browse", hasDropdown: true },
  { label: "Recommendations", href: "/recommendations", hasDropdown: true },
  { label: "Categories", href: "/categories", hasDropdown: true },
  { label: "Ways to Play", href: "/ways-to-play", hasDropdown: true },
  { label: "Special Sections", href: "/special", hasDropdown: true },
];

const ACTIVE_PATH = "/";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100); // Show sub-nav after 100px scroll
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── MAIN HEADER (always visible) ── */}
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-transform duration-150",
          isScrolled ? "-translate-y-full " : "translate-y-0",
        ].join(" ")}
      >
        <div className="absolute inset-0 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06]" />

        <nav className="relative flex items-center justify-between px-6 md:px-8 h-26 max-w-[1200px] mx-auto">
          {/* LEFT: Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4.5 h-4.5 text-white"
                  fill="currentColor"
                >
                  <path d="M7 6h10a5 5 0 0 1 5 5v2a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-2a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3H7zm1 2h2v1.5h1.5v-1.5h2v1.5H15V12h-1.5v1.5h-2V12H10v1.5H8v-2H6.5v-1.5H8V10zm9.5 1.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm-1.5-1.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z" />
                </svg>
              </div>
            </div>
            <span className="text-[17px] font-bold text-white tracking-[-0.03em] group-hover:text-white/90 transition-colors duration-150">
              Game<span className="text-violet-400">Rec</span>
            </span>
          </a>

          {/* CENTER: Nav links */}
          <ul className="hidden md:flex items-center mr-[20rem]">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = href === ACTIVE_PATH;
              return (
                <li key={label}>
                  <a
                    href={href}
                    className={[
                      "relative px-4 py-1.5 text-[18px] font-bold rounded-lg transition-all duration-150",
                      "outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60",
                      isActive
                        ? "text-violet-400"
                        : "text-white/50 hover:text-white/90",
                    ].join(" ")}
                  >
                    {label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-violet-400" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* RIGHT: User section */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setUserOpen(false);
                }}
                className="relative flex items-center justify-center w-9 h-9 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.07] transition-all duration-150 cursor-pointer"
                aria-label="Notifications"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    d="M15 17H5a2 2 0 0 1-1.4-3.4l.9-.9V9a7 7 0 0 1 14 0v3.7l.9.9A2 2 0 0 1 18 17h-3zm0 0a3 3 0 0 1-6 0"
                  />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 ring-2 ring-[#0a0a0f]" />
              </button>

              {notifOpen && !isScrolled && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#13131e] border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-white">
                      Notifications
                    </span>
                    <button className="text-[11px] text-violet-400 hover:text-violet-300 cursor-pointer">
                      Mark all read
                    </button>
                  </div>
                  {[
                    {
                      title: "New recommendation!",
                      body: "Based on Elden Ring, try Lies of P",
                      time: "2m ago",
                      unread: true,
                    },
                    {
                      title: "Library updated",
                      body: "Hades added to your library",
                      time: "1h ago",
                      unread: false,
                    },
                  ].map((n, i) => (
                    <div
                      key={i}
                      className={`px-4 py-3 flex gap-3 hover:bg-white/[0.04] transition-colors cursor-pointer ${n.unread ? "bg-violet-500/[0.05]" : ""}`}
                    >
                      <div
                        className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.unread ? "bg-violet-400" : "bg-transparent"}`}
                      />
                      <div>
                        <p className="text-[13px] font-medium text-white/90">
                          {n.title}
                        </p>
                        <p className="text-[12px] text-white/50 mt-0.5">
                          {n.body}
                        </p>
                        <p className="text-[11px] text-white/30 mt-1">
                          {n.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User avatar / dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setUserOpen(!userOpen);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-lg hover:bg-white/[0.07] transition-all duration-150 cursor-pointer group"
                aria-label="User menu"
              >
                <div className="relative w-7 h-7 rounded-lg overflow-hidden ring-1 ring-white/10 group-hover:ring-violet-500/40 transition-all duration-150">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-fuchsia-600" />
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
                    JD
                  </span>
                </div>
                <span className="hidden lg:block text-[13px] font-medium text-white/70 group-hover:text-white/90 transition-colors duration-150">
                  John Doe
                </span>
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className={`w-3 h-3 text-white/30 transition-transform duration-200 ${userOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </button>

              {userOpen && !isScrolled && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-52 sm:w-52 rounded-xl bg-[#13131e] border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden py-1 sm:right-0 right-[-1rem] z-50">
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-[13px] font-semibold text-white">
                      John Doe
                    </p>
                    <p className="text-[11px] text-white/40 mt-0.5">
                      john@example.com
                    </p>
                  </div>
                  {[
                    {
                      icon: "M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z",
                      label: "Edit Profile",
                    },
                    {
                      icon: "M12 6.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 12h2m16 0h2M12 2v2m0 16v2m-7.07-14.07l1.41 1.41m9.9 9.9l1.41 1.41M4.93 19.07l1.41-1.41m9.9-9.9l1.41-1.41",
                      label: "Preferences",
                    },
                    {
                      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                      label: "Subscription",
                    },
                  ].map(({ icon, label }) => (
                    <button
                      key={label}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors duration-100 cursor-pointer"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        className="w-4 h-4 shrink-0"
                      >
                        <path d={icon} />
                      </svg>
                      {label}
                    </button>
                  ))}
                  <div className="border-t border-white/[0.06] mt-1 pt-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors duration-100 cursor-pointer">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        className="w-4 h-4 shrink-0"
                      >
                        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.07] transition-all duration-150 cursor-pointer"
              aria-label="Open menu"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="w-5 h-5"
              >
                {menuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* ── SUB NAVBAR (appears on scroll) ── */}
      <div
        className={[
          "fixed top-10 left-0 right-0 z-40 bg-[#12121a]/65 backdrop-blur-sm border-b border-white/[0.04] transition-all duration-150 ease-out ",
          isScrolled
            ? "opacity-100 -translate-y-10 pointer-events-none"
            : "opacity-100 translate-y-16",
        ].join(" ")}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 h-12 flex items-center justify-between gap-4">
          {/* Left: Category links */}
          <ul className="hidden md:flex items-center gap-1">
            {SUB_NAV_LINKS.map(({ label, href, hasDropdown }) => (
              <li key={label}>
                <a
                  href={href}
                  className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05] rounded-md transition-all duration-150"
                >
                  {label}
                  {hasDropdown && (
                    <svg
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-3 h-3 text-white/40"
                    >
                      <path
                        d="M4 6l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Right: Search bar */}
          <div className="flex-1 max-w-md ml-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search the store..."
                className="w-full h-9 pl-3 pr-10 rounded-md bg-[#0d1117] border border-white/[0.08] text-[13px] text-white/80 placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all duration-150"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded bg-violet-600 hover:bg-violet-500 transition-colors duration-150 cursor-pointer">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-3.5 h-3.5 text-white"
                >
                  <circle cx="8.5" cy="8.5" r="5.25" />
                  <path strokeLinecap="round" d="M13 13l3.5 3.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile: just show search icon */}
          <button className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.07] transition-all duration-150 cursor-pointer">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="w-4 h-4"
            >
              <circle cx="8.5" cy="8.5" r="5.25" />
              <path strokeLinecap="round" d="M13 13l3.5 3.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Blurred backdrop overlay ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ── Mobile nav drawer ── */}
      {menuOpen && (
        <div className="fixed top-16 left-0 right-0 z-50 md:hidden border-t border-white/[0.06] bg-[#0a0a0f]/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-1 shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = href === ACTIVE_PATH;
            return (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={[
                  "px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors duration-150",
                  isActive
                    ? "text-white bg-white/[0.08]"
                    : "text-white/50 hover:text-white/90 hover:bg-white/[0.05]",
                ].join(" ")}
              >
                {label}
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}
