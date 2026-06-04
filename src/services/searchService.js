import API from "../api/api";

const searchGames = async ({
    q,
    page = 1,
    limit = 15,
}) => {
    const res = await API.get("/search", {
        params: {
            q,
            page,
            limit,
        }
    })

    return res.data
}

export default {
    searchGames
}