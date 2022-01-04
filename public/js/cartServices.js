const getCartService = async () => {
    try {
        const token = window.localStorage.getItem('user-token')
        const response = await fetch('users/cart', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json()
        if (data.status === 200) {
            return data.cart
        } else {
            throw { status: 400, message: "could not find your cart" }
        }
    } catch (err) {
        throw err
    }
}

const clearCartService = async () => {
    const token = window.localStorage.getItem('user-token')
    try {
        const token = window.localStorage.getItem('user-token')
        const response = await fetch('users/clear-cart', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json()
        if (data.status === 200) {
            return
        } else {
            throw { data }
        }
    } catch (err) {
        throw err
    }
}