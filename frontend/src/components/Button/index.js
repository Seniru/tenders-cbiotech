import "./Button.css"

export default function Button({ kind, onClick, children, ...props }) {
    return (
        <button className={kind || "primary"} onClick={onClick} {...props}>
            {children}
        </button>
    )
}
