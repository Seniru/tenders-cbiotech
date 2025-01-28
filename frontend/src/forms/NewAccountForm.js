import { useState } from "react"

import Input from "../components/Input"
import Select from "../components/Select"
import Button from "../components/Button"
import MessageBox from "../components/MessageBox"
import { useAuth } from "../contexts/AuthProvider"

const { REACT_APP_API_URL } = process.env

export default function NewAccountForm({ refreshUsers, setRefreshUsers }) {
    let [username, setUsername] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [role, setRole] = useState("admin")
    let [error, setError] = useState(null)
    let [info, setInfo] = useState(null)
    let { token } = useAuth()

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        const response = await fetch(`${REACT_APP_API_URL}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ username, email, password, role }),
        })
        const result = await response.json()
        if (!response.ok) return setError(result.body)
        setInfo("Account created!")
        setRefreshUsers(!refreshUsers)
        // reset the input fields
        setUsername("")
        setEmail("")
        setPassword("")
        setRole("admin")
    }

    return (
        <>
            <MessageBox isError={true} message={error} setMessage={setError} />
            <MessageBox isError={false} message={info} setMessage={setInfo} />
            <form onSubmit={handleSubmit}>
                <label>User name</label>
                <br />
                <Input
                    type="text"
                    onChange={(evt) => setUsername(evt.target.value)}
                    value={username}
                />
                <br />

                <label>Email</label>
                <br />
                <Input
                    type="email"
                    onChange={(evt) => setEmail(evt.target.value)}
                    value={email}
                />
                <br />

                <label>Password</label>
                <br />
                <Input
                    type="password"
                    onChange={(evt) => setPassword(evt.target.value)}
                    value={password}
                />
                <br />

                <label>Role</label>
                <br />
                <Select
                    items={{
                        admin: "Admin",
                        contributer: "Contributer",
                        viewer: "Viewer",
                    }}
                    value={role}
                    onChange={(evt) => setRole(evt.target.value)}
                />
                <br />
                <br />

                <Button kind="primary">Create new user</Button>
            </form>
        </>
    )
}
