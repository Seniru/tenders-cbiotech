import "./SearchBar.css"
import searchIcon from "../../assets/images/search-solid.svg"

export default function SearchBar({ placeholder, style, ...props }) {
    return (
        <div className="search-bar-container" style={style}>
            <input
                type="search"
                className="search-bar"
                placeholder={placeholder}
                {...props}
            />
            <img src={searchIcon} alt="Search Icon" className="search-icon" />
        </div>
    )
}
