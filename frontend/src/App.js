import { BrowserRouter, Routes, Route } from "react-router-dom"

import { AuthProvider } from "./contexts/AuthProvider"
import Layout from "./components/Layout"
import Index from "./pages/Index"
import Components from "./pages/Components"
import Product from "./pages/Product"
import TenderByDate from "./pages/TendersByDate"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Admin from "./pages/Admin"

function App() {
    return (
        <div className="App">
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Index />} />
                            <Route path="components" element={<Components />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="admin" element={<Admin />} />
                            <Route
                                path="product/:productName"
                                element={<Product />}
                            />
                            <Route
                                path="tenders/:date"
                                element={<TenderByDate />}
                            />
                            <Route path="login" element={<Login />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </div>
    )
}

export default App
