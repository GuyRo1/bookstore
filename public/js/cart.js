async function getCartData() {
    try {
        const cart = window.localStorage.getItem('anonymousCart')
        let cartObject
        let urls = []
        if (cart) {
            cartObject = JSON.parse(cart)
            cartObject.books.forEach(item => {
                urls.push(`/books/${item.bookID}`)
            })

            if (urls.length > 0) {
                const requests = urls.map((url) => fetch(url))
                const responses = await Promise.all(requests)
                const promises = responses.map((response) => response.json())
                return await Promise.all(promises)
            } else {
                throw err
            }
        } else {
            throw err
        }
    } catch (err) {
        throw err
    }
}

getCartData().then(result=>{
    console.log(result);
}).catch(err=>{
    console.log(err);
})