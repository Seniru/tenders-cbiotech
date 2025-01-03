import Button from "../components/Button"
import Input from "../components/Input"
import Select from "../components/Select"
import Table from "../components/Table"

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
    const handleSubmit = async (evt) => {
        evt.preventDefault()
    }

    return (
        <div>
            <h1>Admin</h1>
            <div className="container">
                <h3>Create new user</h3>
                <form onSubmit={handleSubmit}>
                    <label>User name</label>
                    <br />
                    <Input type="text" />
                    <br />
                    <label>Email</label>
                    <br />
                    <Input type="email" />
                    <br />
                    <label>Password</label>
                    <br />
                    <Input type="password" />
                    <br />
                    <label>Role</label>
                    <br />
                    <Select
                        items={{
                            admin: "Admin",
                            editor: "Editor",
                            viewer: "Viewer",
                        }}
                    />
                    <br />
                    <br />
                    <Button isPrimary={true}>Create new user</Button>
                </form>
            </div>
            <hr />
            <h3>Users</h3>
            <Table
                headers={["Name", "Email", "Role", ""]}
                rows={[
                    {
                        username: "Seniru",
                        email: "senirupasan@gmail.com",
                        role: "admin",
                    },
                    {
                        username: "Person1",
                        email: "person1@gmail.com",
                        role: "contributer",
                    },
                    {
                        username: "Person1",
                        email: "person1@gmail.com",
                        role: "contributer",
                    },
                    {
                        username: "Person1",
                        email: "person1@gmail.com",
                        role: "contributer",
                    },
                    {
                        username: "Person1",
                        email: "person1@gmail.com",
                        role: "contributer",
                    },
                    {
                        username: "Person1",
                        email: "person1@gmail.com",
                        role: "contributer",
                    },
                ]}
                renderRowWith={UserRow}
            />
        </div>
    )
}
