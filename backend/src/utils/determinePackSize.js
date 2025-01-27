const determinePackSize = (packSize) => {
    let sizes = packSize.split(/\s*[xX*]\s*/gi)
    return sizes.reduce((total, current) => {
        let size = current.match(/(\d+)/)
        size = size ? parseInt(size[1]) : 1
        return total * size
    }, 1)
}

module.exports = determinePackSize
