import "./SearchBar.css";
import searchIcon from "../../assets/images/search-solid.svg";

export default function SearchBar({ placeholder }) {
	return (
		<div className="search-bar-container">
			<input
				type="search"
				className="search-bar"
				placeholder={placeholder}
			/>
			<img src={searchIcon} alt="Search Icon" className="search-icon" />
		</div>
	);
}
