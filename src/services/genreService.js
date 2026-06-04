import API from '../api/api'

const getGenres = async () => {
    const res = await API.get("/genres")

    return res.data
}

const getGamesByGenre = async ({
    genre,
    page = 1,
    limit = 15,
}) => {
    const res = await API.get(`/genres/${genre}`, {
        params: {
            page,
            limit,
        }
    })

    return res.data
}

export default {
    getGenres,
    getGamesByGenre
}