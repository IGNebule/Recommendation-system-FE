import API from "../api/api"

const getGames = async ({ page = 1, limit = 15} = {}) =>  {
    const res = await API.get('/games', {
        params: {
            page,
            limit,
        }
    })

    return res.data
}

const getGameById = async (appid) => {
    const res = await API.get(`/games/${appid}`)

    return res.data
}

export default {
    getGames,
    getGameById,
}