import { useState } from "react"

import { useAuth } from "../contexts/AuthProvider"
import Input from "../components/Input"
import Button from "../components/Button"
import MessageBox from "../components/MessageBox"

const { REACT_APP_API_URL } = process.env

export default function EditPasswordForm() {
    let [password, setPassword] = useState("")
    let [confirmationPassword, setConfirmationPassword] = useState("")
    let [isError, setIsError] = useState(false)
    let [message, setMessage] = useState("")
    let { user, token } = useAuth()

    const handleSubmit = async (evt) => {
        evt.preventDefault()

        if (password !== confirmationPassword) {
            setIsError(true)
            setMessage("Password and confirmation password should match")
            return
        }

        let response = await fetch(`${REACT_APP_API_URL}/api/users`, {
            method: "PATCH",
            headers: {
                Authorization: "Token " + token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email, password }),
        })

        let result = await response.json()
        if (response.ok) {
            setIsError(false)
            setMessage("Password updated")
            setPassword("")
            setConfirmationPassword("")
        } else {
            setIsError(true)
            setMessage(result.body || response.statusText)
        }
    }

    return (
        <>
            <MessageBox
                isError={isError}
                message={message}
                setMessage={setMessage}
            />
            <h3>Change password</h3>
            <form
                className="container"
                style={{ width: "calc(100vw - 320px)" }}
                onSubmit={handleSubmit}
            >
                <label htmlFor="password">Password</label>
                <br />
                <Input
                    type="password"
                    id="password"
                    placeholder="Please enter your password..."
                    value={password}
                    onChange={(evt) => setPassword(evt.target.value)}
                    required
                />
                <br />
                <label htmlFor="conf-password">Re-enter password</label>
                <br />
                <Input
                    type="password"
                    id="conf-password"
                    placeholder="Please re-enter your password..."
                    value={confirmationPassword}
                    onChange={(evt) =>
                        setConfirmationPassword(evt.target.value)
                    }
                    required
                />
                <br />
                <br />
                <Button kind="primary">Change Password</Button>
            </form>
        </>
    )
}
