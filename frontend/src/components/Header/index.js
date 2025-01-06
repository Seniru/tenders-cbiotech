import { Link } from "react-router-dom"
import logo from "../../assets/images/favicon.png"
import { useAuth } from "../../contexts/AuthProvider"
import "./Header.css"
import ProfileButton from "./ProfileButton"

export default function Header() {
    let { user } = useAuth()

    let links = {}
    if (user) {
        links["/"] = "Index"
        if (user.role === "admin") links["/admin"] = "Admin"
    }

    return (
        <header>
            <div style={{ display: "flex" }}>
                /
                <img src={logo} alt="logo" />
                <nav className="header-nav">
                    <ul>
                        {Object.entries(links).map(([path, name], index) => (
                            <li key={index}>
                                <Link to={path}>{name}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <ProfileButton profile={user} />
        </header>
    )
}
