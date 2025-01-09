import { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons"

import "./styles/Profile.css"
import { useAuth } from "../contexts/AuthProvider"
import EditPasswordForm from "../forms/EditPasswordForm"

function ProfileDetail({ icon, detail }) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "20px 1fr",
                gap: 5,
            }}
        >
            {icon ? <FontAwesomeIcon icon={icon} /> : <span></span>}
            {detail}
        </div>
    )
}

export default function Profile() {
    let { user } = useAuth()

    useEffect(() => {
        document.title = user.username + " | Cliniqon Biotech"
    }, [user])

    return (
        <div style={{ display: "flex" }}>
            <aside className="profile-sidebar">
                <div>
                    <div>
                        <div className="profile-sidebar-profile-icon">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <h2 style={{ color: "white" }}>Profile</h2>
                        <hr />
                        <br />
                        <div>
                            <ProfileDetail
                                icon={faUser}
                                detail={user.username}
                            />
                            <ProfileDetail
                                icon={faEnvelope}
                                detail={user.email}
                            />
                            <ProfileDetail
                                icon={null}
                                detail={
                                    user.role.charAt(0).toUpperCase() +
                                    user.role.substring(1)
                                }
                            />
                        </div>
                    </div>
                </div>
            </aside>
            <div
                style={{
                    marginLeft: 240,
                }}
            >
                <EditPasswordForm />
            </div>
        </div>
    )
}
