import { useEffect } from "react"
import Button from "../components/Button"
import Table from "../components/Table"
import NewAccountForm from "../forms/NewAccountForm"
import useFetch from "../hooks/useFetch"

const { REACT_APP_API_URL } = process.env

function UserRow({ row, index }) {
    return (
        <tr>
            <td>{row.username}</td>
            <td>{row.email}</td>
            <td>{row.role}</td>
            <td>
                <Button isPrimary={true}>Remove user</Button>
            </td>
        </tr>
    )
}

export default function Admin() {
    let [users] = useFetch(`${REACT_APP_API_URL}/api/users`, [])

    useEffect(() => {
        document.title = "Admin | Cliniqon Biotech"
    }, [])

    return (
        <div>
            <h1>Admin</h1>
            <div className="container">
                <h3>Create new user</h3>
                <NewAccountForm />
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
