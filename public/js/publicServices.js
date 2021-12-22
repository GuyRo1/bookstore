const getAllBooksRequest = async queryString => {
    try {
        const uri = `/books${queryString}`
        const response = await fetch(uri)
        const data = await response.json()
        return data
    } catch (err) {
        throw err
    }
}

const getBookRequest = async bookID =>{
    try {
        const uri = `/books/${bookID}`
        const response = await fetch(uri)
        const data = await response.json()
        return data
    } catch (err) {
        throw err
    }
}

