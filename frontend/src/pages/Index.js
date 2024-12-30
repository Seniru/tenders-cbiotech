import Button from "../components/Button";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";

export default function Index() {
	return (
		<>
			<h1>Index</h1>
			<div>
				<SearchBar
					placeholder="Search products..."
					style={{ width: "60%", marginRight: 6 }}
				/>
				<Button isPrimary={true}>Go</Button>
			</div>
			<div className="secondary-text">Showing 800 products...</div>
			<div className="container" style={{ marginTop: 10 }}>
				<ProductList
					products={[
						{
							product: "Product 1",
							bidder: "Bidder 1",
							manufacturer: "Manufacturer 1",
							currency: "USD",
							quotedPrice: 1.0,
						},
						{
							product: "Product 1",
							bidder: "Bidder 1",
							manufacturer: "Manufacturer 1",
							currency: "USD",
							quotedPrice: 1.0,
						},
						{
							product: "Product 1",
							bidder: "Bidder 1",
							manufacturer: "Manufacturer 1",
							currency: "USD",
							quotedPrice: 1.0,
						},
						{
							product: "Product 1",
							bidder: "Bidder 1",
							manufacturer: "Manufacturer 1",
							currency: "USD",
							quotedPrice: 1.0,
						},
						{
							product: "Product 1",
							bidder: "Bidder 1",
							manufacturer: "Manufacturer 1",
							currency: "USD",
							quotedPrice: 1.0,
						},
						{
							product: "Product 1",
							bidder: "Bidder 1",
							manufacturer: "Manufacturer 1",
							currency: "USD",
							quotedPrice: 1.0,
						},
						{
							product: "Product 1",
							bidder: "Bidder 1",
							manufacturer: "Manufacturer 1",
							currency: "USD",
							quotedPrice: 1.0,
						},
						{
							product: "Product 1",
							bidder: "Bidder 1",
							manufacturer: "Manufacturer 1",
							currency: "USD",
							quotedPrice: 1.0,
						},
						{
							product: "Product 1",
							bidder: "Bidder 1",
							manufacturer: "Manufacturer 1",
							currency: "USD",
							quotedPrice: 1.0,
						},
						{
							product: "Product 1",
							bidder: "Bidder 1",
							manufacturer: "Manufacturer 1",
							currency: "USD",
							quotedPrice: 1.0,
						},
					]}
				/>
			</div>
		</>
	);
}
