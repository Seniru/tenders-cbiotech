import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Index from "./pages/Index";
import Components from "./pages/Components";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Index />} />
						<Route path="components" element={<Components />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
