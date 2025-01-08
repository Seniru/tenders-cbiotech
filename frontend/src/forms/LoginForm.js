import { useState } from "react"

import { useAuth } from "../contexts/AuthProvider"
import Input from "../components/Input"
import Button from "../components/Button"
import MessageBox from "../components/MessageBox"

export default function LoginForm() {
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [error, setError] = useState("")

    let { loginAction } = useAuth()

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        let err = await loginAction({ email, password })
        if (err) setError(err)
    }

    return (
        <>
            <MessageBox isError={true} message={error} setMessage={setError} />
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

                <Button type="submit" isPrimary={true}>
                    Login
                </Button>
            </form>
        </>
    )
}
