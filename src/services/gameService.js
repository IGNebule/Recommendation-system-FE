import API from '../api/api'

const getGames = async () => {
    const res = await API.get("/games")

    return res.data
}

export default getGames