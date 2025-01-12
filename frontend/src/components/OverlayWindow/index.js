import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

export default function OverlayWindow({ isOpen, setIsOpen, children }) {
    const closeWindow = (evt) => {
        setIsOpen(false)
    }

    return (
        <div
            className="container"
            style={{
                display: isOpen ? "block" : "none",
                position: "fixed",
                width: "75%",
                height: "70%",
                top: "15%",
                left: "12.5%",
                zIndex: 9999,
                boxShadow: "0px 0px 0px 1000000px rgba(0, 0, 0, 0.25)",
                overflow: "scroll",
            }}
        >
            <div
                style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: 6,
                    right: 6,
                }}
                onClick={closeWindow}
            >
                <FontAwesomeIcon icon={faXmark} />
            </div>
            {children}
        </div>
    )
}
