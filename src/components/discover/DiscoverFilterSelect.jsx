const DiscoverFilterSelect = ({
  label,
  value,
  options = [],
  placeholder = "All",
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded border border-white/10 bg-[#171622] px-3 text-sm text-white outline-none transition focus:border-violet-500"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DiscoverFilterSelect;
