import { Outlet } from "react-router-dom"
import Header from "./Header"

export default function Layout() {
    return (
        <>
            <Header />
            <div style={{ margin: 12 }}>
                <Outlet />
            </div>
        </>
    )
}
