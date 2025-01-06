import { BrowserRouter, Routes, Route } from "react-router-dom"

import { AuthProvider } from "./contexts/AuthProvider"
import PrivateRoute from "./components/PrivateRoute"
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
                            <Route path="components" element={<Components />} />
                            <Route path="login" element={<Login />} />
                            <Route element={<PrivateRoute />}>
                                <Route index element={<Index />} />
                                <Route path="profile" element={<Profile />} />
                                <Route
                                    path="product/:productName"
                                    element={<Product />}
                                />
                                <Route
                                    path="tenders/:date"
                                    element={<TenderByDate />}
                                />
                            </Route>
                            <Route
                                element={<PrivateRoute minimumRole="admin" />}
                            >
                                <Route path="admin" element={<Admin />} />
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </div>
    )
}

export default App
