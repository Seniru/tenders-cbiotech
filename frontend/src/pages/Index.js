import { useState, useEffect, useRef, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faCalendar,
    faCalendarDay,
    faFilter,
} from "@fortawesome/free-solid-svg-icons"

import { useAuth } from "../contexts/AuthProvider"
import useFetch from "../hooks/useFetch"
import Button from "../components/Button"
import ProductList from "../components/ProductList"
import SearchBar from "../components/SearchBar"
import Input from "../components/Input"
import MessageBox from "../components/MessageBox"
import NewTenderForm from "../forms/NewTenderForm"

import "./styles/Index.css"

const { REACT_APP_API_URL } = process.env

export default function Index() {
    let [tendersOnDate, setTendersOnDate] = useState(
        new Date().toISOString().split("T")[0],
    )
    let [addTenderFormOpen, setAddTenderFormOpen] = useState(false)
    let [addingProduct, setAddingProduct] = useState("")
    let [query, setQuery] = useState("")
    let [q, setQ] = useState("")
    let [options, setOptions] = useState("")
    let fromDateRef = useRef()
    let toDateRef = useRef()
    let [fromDate, setFromDate] = useState(null)
    let [toDate, setToDate] = useState(null)
    let [message, setMessage] = useState(null)
    let [isError, setIsError] = useState(false)
    let [refreshList, setRefreshList] = useState(false)
    let [, setSearchParams] = useSearchParams()

    const queryParams = useMemo(() => {
        const params = {
            q,
            ...options,
        }

        if (fromDate) params.fromDate = fromDate
        if (toDate) params.toDate = toDate

        return params
    }, [q, options, fromDate, toDate])

    let [products, productFetchError, productsLoading] = useFetch(
        `${REACT_APP_API_URL}/api/tenders?` +
            new URLSearchParams(queryParams).toString(),
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

    useEffect(() => {
        setSearchParams(new URLSearchParams(queryParams).toString())
    }, [queryParams, setSearchParams])

    const handleSearchByDate = () => {
        if (tendersOnDate) window.open(`/tenders/${tendersOnDate}`, "_blank")
    }

    const handleSearchByDateRange = () => {
        if (!fromDateRef.current.value) {
            setIsError(true)
            setMessage("You should set the starting date")
            return
        } else if (!toDateRef.current.value) {
            setIsError(true)
            setMessage("You should set the end date")
            return
        }
        window.open(
            `/tenders/${fromDateRef.current.value}:${toDateRef.current.value}`,
            "_blank",
        )
    }

    const addTender = (product) => {
        setAddTenderFormOpen(true)
        setAddingProduct(product)
    }

    const filterDateRange = () => {
        setFromDate(fromDateRef.current.value)
        setToDate(toDateRef.current.value)
    }

    const resetDateRanges = () => {
        setFromDate(null)
        setToDate(null)
        fromDateRef.current.value = ""
        toDateRef.current.value = ""
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
            <h1>Index</h1>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <SearchBar
                        placeholder="Search products..."
                        style={{ width: "55vw", marginRight: 6 }}
                        onChange={(evt) => setQuery(evt.target.value)}
                        onKeyDown={(evt) => {
                            if (evt.code === "Enter") setQ(query)
                        }}
                    />
                    <Button kind="primary" onClick={(evt) => setQ(query)}>
                        Go
                    </Button>
                </div>
                <div>
                    <Input
                        type="date"
                        value={tendersOnDate}
                        onChange={(e) => setTendersOnDate(e.target.value)}
                    />
                    <Button kind="primary" onClick={handleSearchByDate}>
                        <FontAwesomeIcon icon={faCalendarDay} />
                        <span style={{ marginLeft: 5 }}>Browse date</span>
                    </Button>
                </div>
            </div>
            <br />
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <div style={{ marginBottom: 10 }}>
                    <label className="view-options">
                        <Input
                            type="radio"
                            name="options"
                            onChange={() => setOptions({})}
                            defaultChecked={true}
                        />
                        Default view
                    </label>

                    <label className="view-options">
                        <Input
                            type="radio"
                            name="options"
                            onChange={() => setOptions({ maxBidders: 0 })}
                        />
                        No offers
                    </label>
                    <label className="view-options">
                        <Input
                            type="radio"
                            name="options"
                            onChange={() =>
                                setOptions({ minBidders: 1, maxBidders: 2 })
                            }
                        />
                        2 bidders
                    </label>
                    <label className="view-options">
                        <Input
                            type="radio"
                            name="options"
                            onChange={() =>
                                setOptions({ matchBidders: "slim,cliniqon" })
                            }
                        />
                        Bidders: Slim or Cliniqon
                    </label>
                </div>
                <div>
                    From:
                    <Input type="date" ref={fromDateRef} />
                    To:
                    <Input type="date" ref={toDateRef} />
                    <Button kind="primary" onClick={filterDateRange}>
                        <FontAwesomeIcon icon={faFilter} /> Apply
                    </Button>
                    <Button kind="primary" onClick={handleSearchByDateRange}>
                        <FontAwesomeIcon icon={faCalendar} /> Browse date range
                    </Button>
                    <Button kind="secondary" onClick={resetDateRanges}>
                        Reset
                    </Button>
                </div>
            </div>
            <hr />
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
                    options={
                        new URLSearchParams(
                            Object.fromEntries(
                                Object.entries({
                                    fromDate: queryParams.fromDate,
                                    toDate: queryParams.toDate,
                                    latestOnly:
                                        Object.hasOwn(
                                            queryParams,
                                            "minBidders",
                                        ) ||
                                        Object.hasOwn(
                                            queryParams,
                                            "maxBidders",
                                        ) ||
                                        Object.hasOwn(
                                            queryParams,
                                            "matchBidders",
                                        ),
                                }).filter(([_, v]) => v != null),
                            ),
                        )
                    }
                />
            </div>
        </>
    )
}
