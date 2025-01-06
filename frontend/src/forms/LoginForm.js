import { useState } from "react"

import { useAuth } from "../contexts/AuthProvider"
import Input from "../components/Input"
import Button from "../components/Button"

export default function () {
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")

    let { loginAction } = useAuth()

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        loginAction({ email, password })
    }

    return (
        <form
            style={{
                display: "grid",
                padding: 80,
            }}
            className="container"
            onSubmit={handleSubmit}
        >
            <label>Email</label>
            <Input
                type="email"
                onChange={(evt) => setEmail(evt.target.value)}
                required
            />
            <br />

            <label>Password</label>
            <Input
                type="password"
                onChange={(evt) => setPassword(evt.target.value)}
                required
            />
            <br />

            <Button isPrimary={true}>Login</Button>
        </form>
    )
}
