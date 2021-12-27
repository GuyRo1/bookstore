async function adminLogin(userName, password) {
    try {
        const credentials = { userName, password }
        const response = await fetch('/admins/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json()

        if (!data.token) throw { message:"Invalid user name or password"}

        const sessionStorage = window.sessionStorage
        sessionStorage.setItem('admin-token', data.token)
        return data.token

    } catch (err) {
        throw err
    }

}

const checkIfSignedIn = async () => {
    try {
        const adminToken = window.sessionStorage.getItem('admin-token')
        const response = await fetch('/admins/check', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + adminToken
            },

        })

        const data = await response.json()

        if (data.status !== 200) throw { status: "not logged in" }

        return true
    } catch (err) {
        return false
    }
}

const deleteBookRequest = async bookID => {
    try {
        const adminToken = window.sessionStorage.getItem('admin-token')
        const response = await fetch(`/books/${bookID}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + adminToken
            },
        });
        let result = await response.json()
        return result
    } catch (err) {
        throw err
    }
}

const editBookRequest = async book => {
    try {
        const token = window.sessionStorage.getItem('admin-token')
        const response = await fetch(`/books/${book.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(book)
        });
        const data = await response.json()
        return data
    } catch (err) {
        throw err
    }
}

const addBookRequest = async newBook => {
    try {
        const token = window.sessionStorage.getItem('admin-token')
        const response = await fetch('/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(newBook)
        });

        let data = await response.json()
        return data
    } catch (err) {
        throw err
    }
}

const getAllBooksRequest = async () => {
    try {
        const response = await fetch('/books')
        const data = await response.json()
        return data
    } catch (err) {
        throw err
    }
}



