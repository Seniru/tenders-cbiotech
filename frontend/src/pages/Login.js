import { useEffect } from "react"

import LoginForm from "../forms/LoginForm"

export default function Login() {
    useEffect(() => {
        document.title = "Admin | Cliniqon Biotech"
    }, [])

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
            <LoginForm />
        </div>
    )
}
