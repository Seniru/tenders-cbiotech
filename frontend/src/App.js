import { BrowserRouter, Routes, Route } from "react-router-dom"

import Layout from "./components/Layout"
import Index from "./pages/Index"
import Components from "./pages/Components"
import Product from "./pages/Product"
import TenderByDate from "./pages/TendersByDate"

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Index />} />
                        <Route path="components" element={<Components />} />
                        <Route
                            path="product/:productName"
                            element={<Product />}
                        />
                        <Route
                            path="tenders/:date"
                            element={<TenderByDate />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
