import API from "../api/api";

const getTags = async () => {
    const res = await API.get("/tags");

    return res.data
}

const getGamesByTag = async ({
    tag,
    page = 1,
    limit = 15,
}) => {
    const res = await API.get(`/tags/${tag}`, {
        params: {
            page,
            limit,
        }
    })

    return res.data
}

export default {
    getTags,
    getGamesByTag
}