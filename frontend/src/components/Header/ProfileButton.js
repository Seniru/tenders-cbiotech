import { Link } from "react-router-dom"
import Button from "../Button"
import "./Header.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "../../contexts/AuthProvider"

export default function ProfileButton({ profile }) {
    const { logoutAction } = useAuth()

    return profile ? (
        <div className="profileButton">
            <Button
                isPrimary={false}
                style={{ color: "white", fontWeight: "bold", marginRight: 10 }}
                onClick={logoutAction}
            >
                Logout
            </Button>
            <div className="profileIcon">
                {profile.username.charAt(0).toUpperCase()}
            </div>
            <Link to="/profile">
                <FontAwesomeIcon icon={faChevronRight} />
            </Link>
        </div>
    ) : (
        <Button isPrimary={true} style={{ marginRight: 20 }}>
            <Link
                to="/login"
                style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
            >
                Login
            </Link>
        </Button>
    )
}
