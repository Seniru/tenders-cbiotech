import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar } from "@fortawesome/free-solid-svg-icons"

import { useAuth } from "../contexts/AuthProvider"
import useFetch from "../hooks/useFetch"
import Button from "../components/Button"
import ProductList from "../components/ProductList"
import SearchBar from "../components/SearchBar"
import Input from "../components/Input"
import MessageBox from "../components/MessageBox"
import NewTenderForm from "../forms/NewTenderForm"

const { REACT_APP_API_URL } = process.env

export default function Index() {
    let [tendersOnDate, setTendersOnDate] = useState(
        new Date().toISOString().split("T")[0],
    )
    let [addTenderFormOpen, setAddTenderFormOpen] = useState(false)
    let [addingProduct, setAddingProduct] = useState("")
    let [query, setQuery] = useState("")
    let [q, setQ] = useState("")
    let [message, setMessage] = useState(null)
    let [isError, setIsError] = useState(false)
    let [refreshList, setRefreshList] = useState(false)
    let [products, productFetchError, productsLoading] = useFetch(
        `${REACT_APP_API_URL}/api/tenders?q=${q}`,
        [],
        refreshList,
    )
    let { user } = useAuth()

    useEffect(() => {
        if (productFetchError) {
            setIsError(true)
            setMessage(productFetchError)
        }
    }, [productFetchError])

    useEffect(() => {
        document.title = "Tenders | Cliniqon Biotech"
    }, [])

    const handleSearchByDate = () => {
        if (tendersOnDate) window.open(`/tenders/${tendersOnDate}`, "_blank")
    }

    const addTender = (product) => {
        setAddTenderFormOpen(true)
        setAddingProduct(product)
    }

    return (
        <>
            <MessageBox
                isError={isError}
                message={message}
                setMessage={setMessage}
            />
            <NewTenderForm
                isOpen={addTenderFormOpen}
                setIsError={setIsError}
                setMessage={setMessage}
                setIsOpen={setAddTenderFormOpen}
                addingProduct={addingProduct}
                refreshList={refreshList}
                setRefreshList={setRefreshList}
            />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <h1>Index</h1>
                <div>
                    <Input
                        type="date"
                        value={tendersOnDate}
                        onChange={(e) => setTendersOnDate(e.target.value)}
                    />
                    <Button kind="primary" onClick={handleSearchByDate}>
                        <FontAwesomeIcon icon={faCalendar} />
                        <span style={{ marginLeft: 5 }}>Search by date</span>
                    </Button>
                </div>
            </div>

            <div>
                <SearchBar
                    placeholder="Search products..."
                    style={{ width: "60%", marginRight: 6 }}
                    onChange={(evt) => setQuery(evt.target.value)}
                    onKeyDown={(evt) => {
                        if (evt.code === "Enter") setQ(query)
                    }}
                />
                <Button kind="primary" onClick={(evt) => setQ(query)}>
                    Go
                </Button>
            </div>
            <div className="secondary-text">
                {productsLoading
                    ? "Loading..."
                    : "Showing " +
                      (products?.body ? products?.body?.tenders?.length : 0) +
                      " products"}
            </div>

            <div className="container" style={{ marginTop: 10 }}>
                <ProductList
                    products={products?.body?.tenders || []}
                    onAdd={addTender}
                    viewingAs={user.role}
                    isLoading={productsLoading}
                />
            </div>
        </>
    )
}
