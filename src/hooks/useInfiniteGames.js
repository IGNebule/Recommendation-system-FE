import { useCallback, useEffect, useMemo, useState } from "react";
import { gameService } from "../services"
import { CanceledError } from "axios";

const dedupeByAppid = (items = []) => {
    const map = new Map()

    items.forEach((item) => {
        map.set(String(item.appid), item)
    })

    return Array.from(map.values())
}

const useInfiniteGames = ({
    limit = 15,
    filters = {},
} = {}) => {
    const [games, setGames] = useState([])
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [error, setError] = useState("")

    const filterKey = useMemo(() => {
        return JSON.stringify(filters)
    }, [filters])

    useEffect(() => {
        let cancelled = false
        
        const fetchFirstPage = async () => {
            try {
                setInitialLoading(true)
                setLoading(true)
                setError("")

                const result = await gameService.getGames({
                    ...filters,
                    page: 1,
                    limit,
                })

                if (cancelled) return;

                setGames(result.data || [])
                setPage(1)
                setTotal(result.total || 0)
                setTotalPages(result.totalPages || 0)
                setHasMore((result.page || 1) < (result.totalPages || 0))
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Failed to fetch games")
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                    setInitialLoading(false)
                }
            }
        }

        fetchFirstPage()

        return () => {
            cancelled = true
        }
    }, [filterKey, limit])

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return

        try {
            setLoading(true)
            setError("")

            const nextPage = page + 1
            const result = await gameService.getGames({
                ...filters,
                page: nextPage,
                limit,
            })

            setGames((prev) => {
                return dedupeByAppid([...prev, ...(result.data || [])])
            })

            setPage(result.page || nextPage)
            setTotal(result.total || 0)
            setTotalPages(result.totalPages || 0)
            setHasMore((result.page || nextPage) < (result.totalPages || 0))
        } catch (err) {
            setError(err.message || "Failed to fetch more games")
        } finally {
            setLoading(false)
        }
    }, [filters, page, limit, loading, hasMore])

    return {
        games,
        total,
        totalPages,
        page,
        hasMore,
        loading,
        initialLoading,
        error,
        loadMore,
    }
}

export default useInfiniteGames