// credits: https://www.w3schools.com/react/react_customhooks.asp

import { useState, useEffect } from "react"

const useFetch = (url, initialValue) => {
    const [data, setData] = useState(initialValue)

    useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => setData(data))
    }, [url])

    return [data]
}

export default useFetch
