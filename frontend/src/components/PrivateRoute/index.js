import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "../../contexts/AuthProvider"

const priviledgeLevels = {
    viewer: 1,
    contributer: 2,
    admin: 3,
}

export default function PrivateRoute({ minimumRole }) {
    let { user } = useAuth()

    if (!user) return <Navigate to="/login" />
    if (priviledgeLevels[user.role] < priviledgeLevels[minimumRole])
        return <Navigate to="/" />
    return <Outlet />
}
