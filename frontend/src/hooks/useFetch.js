// credits: https://www.w3schools.com/react/react_customhooks.asp

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthProvider"

const useFetch = (url, initialValue) => {
    const [data, setData] = useState(initialValue)
    const [error, setError] = useState("")
    let { token } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            try {
                let headers = token ? { Authorization: "Bearer " + token } : {}
                let response = await fetch(url, { headers })
                let result = await response.json()
                if (!response.ok)
                    throw new Error(result.body || response.statusText)
                setData(result)
            } catch (error) {
                setError(error.message)
            }
        }
        fetchData()
    }, [url, token])

    return [data, error]
}

export default useFetch
