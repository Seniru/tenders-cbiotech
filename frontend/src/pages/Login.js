import LoginForm from "../forms/LoginForm"

export default function Login() {
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
