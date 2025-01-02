import logo from "../../assets/images/favicon.png"
import { useAuth } from "../../contexts/AuthProvider"
import "./Header.css"
import ProfileButton from "./ProfileButton"

export default function Header() {
    let { user } = useAuth()

    return (
        <header>
            <div style={{ display: "flex" }}>
                /
                <img src={logo} alt="logo" />
                <nav className="header-nav">
                    <ul>
                        <li>
                            <a href="/">Index</a>
                        </li>
                        <li>
                            <a href="/admin">Admin</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <ProfileButton profile={user} />
        </header>
    )
}
