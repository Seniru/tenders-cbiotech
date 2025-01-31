const applyFilters = (tenders, options) => {
    let { minBidders, maxBidders, matchBidders, fromDate, toDate } = options
    // only filter if the flags are present to save computation time

    // max/min tenders count
    if (maxBidders !== Infinity || minBidders != 0)
        tenders = tenders.filter(
            (tender) => minBidders <= tender.bidders.length && tender.bidders.length <= maxBidders,
        )
    // match bidders
    if (matchBidders.length != 0) {
        tenders = tenders.filter((tender) =>
            tender.bidders.some((bidder) => {
                for (let includeBidder of matchBidders) {
                    if (bidder.bidder.toLowerCase().includes(includeBidder)) return true
                }
                return false
            }),
        )
    }
    // date range
    if (fromDate || toDate)
        tenders = tenders.filter(
            (tender) =>
                (!fromDate || tender.closedOn >= fromDate) &&
                (!toDate || tender.closedOn <= toDate),
        )

    // sort according to latest date if option flags are found
    if (maxBidders !== Infinity || matchBidders.length != 0)
        tenders = tenders.sort((a, b) => b.closedOn - a.closedOn)

    return tenders
}

module.exports = applyFilters
