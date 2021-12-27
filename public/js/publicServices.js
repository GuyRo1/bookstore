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

const getBookRequest = async bookID => {
    try {
        const uri = `/books/${bookID}`
        const response = await fetch(uri)
        const data = await response.json()
        return data
    } catch (err) {
        throw err
    }
}

const checkIfUserLoggedIn = async () => {
    try {
        const userToken = window.localStorage.getItem('user-token')
        const response = await fetch('/users/check', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + userToken
            },
        })

        const data = await response.json()

        if (data.status !== 200) throw { status: "not logged in" }

        return data.user
    } catch (err) {
        return false
    }
}

const addBookToCart = async (newBook) => {
    try {
        const token = window.localStorage.getItem('user-token')
        const response = await fetch('/users/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(newBook)
        });

        const data = await response.json()

        if (data.status === 200)
            return true
        throw { message: "Could not add book to cart" }

    } catch (err) {
        throw err
    }

}



