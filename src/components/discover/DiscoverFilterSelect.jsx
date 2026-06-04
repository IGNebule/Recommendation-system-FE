import { useEffect, useMemo, useRef, useState } from "react";

const DiscoverFilterSelect = ({
  label,
  value,
  options = [],
  placeholder = "All",
  onChange,
}) => {
  const dropdownRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return options;

    return options.filter((option) => {
      return option.label.toLowerCase().includes(keyword);
    });
  }, [options, search]);

  const handleSelect = (nextValue) => {
    onChange(nextValue);
    setIsOpen(false);
    setSearch("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative flex flex-col gap-1">
      <label className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 w-full items-center justify-between rounded border border-white/10 bg-[#171622] px-3 text-left text-sm text-white outline-none transition hover:border-violet-500/60"
      >
        <span className={selectedOption ? "text-white" : "text-white/50"}>
          {selectedOption?.label || placeholder}
        </span>

        <span
          className={`text-xs text-white/40 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-full overflow-hidden rounded border border-white/10 bg-[#171622] shadow-2xl">
                    <div className="max-h-64 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => handleSelect("")}
              className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-violet-500/20 ${
                value === "" ? "bg-violet-600 text-white" : "text-white/70"
              }`}
            >
              {placeholder}
            </button>

            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-violet-500/20 ${
                  value === option.value
                    ? "bg-violet-600 text-white"
                    : "text-white/70"
                }`}
              >
                {option.label}
              </button>
            ))}

            {filteredOptions.length === 0 && (
              <p className="px-3 py-3 text-sm text-white/40">
                No options found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverFilterSelect;
