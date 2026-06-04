import API from "../api/api"

const TOKEN_KEY = "token"

const register = async ({ email, password }) => {
    const res = await API.post("/auth/register", {
        email,
        password,
    })

    return res.data
}

const login = async ({ email, password }) => {
    const res = await API.post("/auth/login", {
        email,
        password,
    })

    const token = res.data?.token

    if (token) {
        localStorage.setItem(TOKEN_KEY, token)
    }

    return res.data
}

const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
}

const getToken = () => {
    return localStorage.getItem(TOKEN_KEY)
}

const isAuthenticated = () => {
    return Boolean(getToken())
}

export default {
    register,
    login,
    logout,
    getToken,
    isAuthenticated,
}