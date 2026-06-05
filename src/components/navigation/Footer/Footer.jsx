import { Link } from "react-router-dom";
import logo from "../../../assets/GameReco.png"

const footerSections = [
  {
    title: "Explore",
    links: [
      { label: "Home", path: "/" },
      { label: "Discover", path: "/discover" },
      { label: "Library", path: "/preferences" },
      { label: "Reports", path: "/reports" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "About", path: "/about" },
      { label: "Support", path: "/support" },
      { label: "Search", path: "/search" },
    ],
  },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/IGNebule",
  },
  {
    label: "Portfolio",
    href: "#",
  },
  {
    label: "Contact",
    href: "mailto:xandernebula@gmail.com",
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-white/10 bg-[#0b0912]">
      <div className="mx-auto w-full max-w-[1260px] px-4 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src={logo}
                alt="GameRec Logo"
                className="h-10 w-auto object-contain"
              />

              <span className="text-xl font-black uppercase tracking-[0.18em] text-white/90">
                GameRec
              </span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/50">
              A content-based game recommendation system using TF-IDF and cosine
              similarity to generate personalized game suggestions from genre,
              category, tag, and textual metadata.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="rounded border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/60 transition hover:border-[#7C3AED] hover:text-[#7C3AED]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Footer links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">
                {section.title}
              </h3>

              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/50 transition hover:text-[#7C3AED]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} GameRec. All rights reserved.</p>

          <p>
            Built for academic recommendation system research using React,
            Express, FastAPI, and TF-IDF.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
