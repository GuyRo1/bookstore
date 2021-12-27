const shoppingCartDiv = document.querySelector('.js-shopping-cart')

let userCartData = {}

let cartData = {
    booksForCart: {},
    cartObject: {}
}

let shoppingCart = {
    cartLines: [],
    priceForCheckout: 0
}

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
                const booksData = await Promise.all(promises)
                return { booksForCart: booksData, cartObject }
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

function mergeCartAndBookData(cartData) {
    const shoppingCart = {
        cartLines: [],
        priceForCheckout: 0
    }

    for (const book of cartData.cartObject.books) {
        let cartLineData = {
            id: book.bookID,
            name: "",
            amount: book.amount,
            price: 0
        }
        for (const bookData of cartData.booksForCart) {
            if (bookData._id === cartLineData.id) {
                cartLineData.name = bookData.name
                cartLineData.price = cartLineData.amount * bookData.price
                shoppingCart.cartLines.push(cartLineData)
                shoppingCart.priceForCheckout += cartLineData.price
            }
        }
    }
    return shoppingCart
}

function generateCartPage(shoppingCart) {
    shoppingCart.cartLines.forEach(item => {
        const cartLineDiv = document.createElement("div")
        cartLineDiv.className = "cart-line"
        for (const key in item) {
            const cartLineProperty = document.createElement('div')
            cartLineProperty.className = key
            cartLineProperty.classList.add('cart-line-property')
            cartLineProperty.textContent = item[key]
            cartLineDiv.append(cartLineProperty)
        }
        shoppingCartDiv.append(cartLineDiv)
    })
    const finalPriceDiv = document.createElement("div")
    finalPriceDiv.className = "final-price-container"
    const finalPrice = document.createElement("div")
    finalPrice.className = "final-price"
    finalPrice.textContent = shoppingCart.priceForCheckout
    const buttonContainer = document.createElement("div")
    buttonContainer.className = "order-now-container"
    const orderNow = document.createElement("button")
    orderNow.className = "order-now"
    orderNow.textContent = "Order Now"
    //change this 
    orderNow.addEventListener("click", () => {
        //change this 
        //this should change some classes for the modal to pop out only
        alert("you bought stuff")
    })
    buttonContainer.append(orderNow)
    const alignmentDiv = document.createElement("div")
    alignmentDiv.className = "div-for-alignment"
    alignmentDiv.textContent = "Final Price"
    finalPriceDiv.append(alignmentDiv)
    finalPriceDiv.append(finalPrice)
    shoppingCartDiv.append(finalPriceDiv)
    shoppingCartDiv.append(buttonContainer)
}

function generateEmptyCartPage() {
    shoppingCartDiv.classList.add('emptyCart')
    shoppingCartDiv.textContent = "No books in cart"
}

function getCartDataForUser(userCartData) {
    const shoppingCart = {
        cartLines: [],
        priceForCheckout: 0
    }

    userCartData.forEach(cartItem => {
        let cartLineData = {
            id: cartItem.book._id,
            name: cartItem.book.name,
            amount: cartItem.amount,
            price: cartItem.book.price * cartItem.amount
        }
        shoppingCart.cartLines.push(cartLineData)
        shoppingCart.priceForCheckout += cartLineData.price
    })

    return shoppingCart
}

async function initializePage() {
    try {
        const userName = await setUserStatus()
        if (userName)
            loggedInAs(userName)
        if (isLoggedIn) {
            const userCartData = await getCartService()
            if (userCartData.length !== 0) {
                shoppingCart = getCartDataForUser(userCartData)
                generateCartPage(shoppingCart)
            } else {
                generateEmptyCartPage()
            }
        } else {
            cartData = await getCartData()
            shoppingCart = mergeCartAndBookData(cartData)
            if (shoppingCart.priceForCheckout !== 0)
                generateCartPage(shoppingCart)
            else
                generateEmptyCartPage()
        }
    } catch (err) {
        throw err
    }
}

initializePage().then().catch(err => {
    console.log(err);
    generateEmptyCartPage()
})




