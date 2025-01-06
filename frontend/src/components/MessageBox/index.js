import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

import "./MessageBox.css"

function MessageComponent({ isError, message, setMessage }) {
    return (
        <div className={`message-box ${isError ? "error-box" : "info-box"}`}>
            <div
                className="message-box-close-button"
                onClick={() => {
                    setMessage(null)
                }}
            >
                <FontAwesomeIcon icon={faXmark} />
            </div>
            {message}
        </div>
    )
}

export default function MessageBox({ isError, message, setMessage }) {
    return (
        message && (
            <MessageComponent
                isError={isError}
                message={message}
                setMessage={setMessage}
            />
        )
    )
}
