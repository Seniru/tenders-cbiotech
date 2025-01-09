import { useEffect, useState } from "react"
import Button from "../components/Button"
import Table from "../components/Table"
import NewAccountForm from "../forms/NewAccountForm"
import useFetch from "../hooks/useFetch"
import { useAuth } from "../contexts/AuthProvider"
import MessageBox from "../components/MessageBox"

const { REACT_APP_API_URL } = process.env

export default function Admin() {
    let [refreshUsers, setRefreshUsers] = useState(false)
    let [users] = useFetch(`${REACT_APP_API_URL}/api/users`, [], refreshUsers)
    let [isError, setIsError] = useState(false)
    let [message, setMessage] = useState(null)
    let { token } = useAuth()

    const removeUser = async (email) => {
        let response = await fetch(`${REACT_APP_API_URL}/api/users`, {
            method: "DELETE",
            headers: {
                Authorization: "Token " + token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        })
        let result = await response.json()
        if (!response.ok) {
            setIsError(true)
            setMessage(result.body || response.statusText)
        } else {
            setIsError(false)
            setMessage("User deleted!")
            setRefreshUsers(!refreshUsers)
        }
    }

    function UserRow({ row, index }) {
        return (
            <tr>
                <td>{row.username}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>
                    <Button
                        kind="primary"
                        onClick={() => removeUser(row.email)}
                    >
                        Remove user
                    </Button>
                </td>
            </tr>
        )
    }

    useEffect(() => {
        document.title = "Admin | Cliniqon Biotech"
    }, [])

    return (
        <div>
            <MessageBox
                isError={isError}
                message={message}
                setMessage={setMessage}
            />
            <h1>Admin</h1>
            <div className="container">
                <h3>Create new user</h3>
                <NewAccountForm
                    refreshUsers={refreshUsers}
                    setRefreshUsers={setRefreshUsers}
                />
            </div>
            <hr />
            <h3>Users</h3>
            <Table
                headers={["Name", "Email", "Role", ""]}
                rows={users?.body?.users || []}
                renderRowWith={UserRow}
            />
        </div>
    )
}
