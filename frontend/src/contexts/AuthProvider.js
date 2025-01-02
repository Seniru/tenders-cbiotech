import { createContext, useContext, useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

const AuthContext = createContext()
const { REACT_APP_API_URL } = process.env

export const AuthProvider = ({ children }) => {
    let [token, setToken] = useState(localStorage.getItem("token") || "")
    let [user, setUser] = useState(() => {
        let token = localStorage.getItem("token")
        if (token) {
            return jwtDecode(token)
        }
        return null
    })

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token)
            setUser(jwtDecode(token))
        } else {
            localStorage.removeItem("token")
            setUser(null)
        }
    }, [token])

    const loginAction = async (data) => {
        try {
            let response = await fetch(`${REACT_APP_API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            let res = await response.json()
            if (res) {
                setToken(res.body.token)
            }
            window.location.href = "/"
        } catch (error) {
            console.error(error)
        }
    }

    const logoutAction = () => {
        setToken("")
        setUser(null)
        localStorage.removeItem("token")
        window.location.href = "/login"
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                setToken,
                user,
                setUser,
                loginAction,
                logoutAction,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
