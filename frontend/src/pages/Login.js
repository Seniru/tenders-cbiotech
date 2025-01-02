import { useState } from "react"

import Input from "../components/Input"
import Button from "../components/Button"
import { useAuth } from "../contexts/AuthProvider"

export default function Login() {
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let { loginAction } = useAuth()

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        loginAction({ email, password })
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "80vh",
            }}
        >
            <h1>Login</h1>
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
        </div>
    )
}
