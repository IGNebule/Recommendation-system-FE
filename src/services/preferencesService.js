import API from "../api/api"

const getPreferences = async () => {
    const res = await API.get("/preferences")

    return res.data
}

const savePreferences = async (appid) => {
    const res = await API.post(`/preferences/${appid}`)

    return res.data
}

const removePreferences = async (appid) => {
    const res = await API.delete(`/preferences/${appid}`)

    return res.data
}

export default {
    getPreferences,
    savePreferences,
    removePreferences
}