import "./Input.css"

export default function Input({ type = "text", value, onChange, ...props }) {
    return <input type={type} value={value} onChange={onChange} {...props} />
}
