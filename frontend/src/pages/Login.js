import Input from "../components/Input"
import Button from "../components/Button"
import { useState } from "react"

const { REACT_APP_API_URL } = process.env

export default function Login() {
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")

    const handleSubmit = async (evt) => {
        evt.preventDefault()

        try {
            let response = await fetch(`${REACT_APP_API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            let data = await response.json()
            console.log(data)
        } catch (error) {
            console.error(error)
        }
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
                    onChange={(evt) => setEmail(evt.target.valeu)}
					required
                />
                <br />
                <label>Password</label>
                <Input
                    type="password"
                    onChange={(evt) => setPassword(evt.target.password)}
					required
                />
                <br />
                <Button isPrimary={true}>Login</Button>
            </form>
        </div>
    )
}
