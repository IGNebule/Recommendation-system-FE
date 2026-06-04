import { useState } from "react";
import { useNavigate } from "react-router-dom"

const searchBar = () => {
    const [query, setQuery] = useState("")
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()

        const trimmed = query.trim()

        if (!trimmed) return

        navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    }

    return (
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search games..."
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
        />
      </form>
    );
}

export default searchBar