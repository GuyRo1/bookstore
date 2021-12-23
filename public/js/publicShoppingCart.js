function generateAddToCartButton(bookID) {
    const buttonContainer = document.createElement('div')
    buttonContainer.className = "button-container"
    const button = document.createElement('button')
    button.textContent = `Add to Cart`
    button.className = "add-to-cart"
    buttonContainer.id = `add-to-cart-${bookID}`
    buttonContainer.appendChild(button)
    buttonContainer.addEventListener('click', (event) => {
        const bookID = event.currentTarget.id.replace('add-to-cart-', '')
        const anonymousCart = window.localStorage.getItem('anonymousCart')
        let cartContent
        if (anonymousCart) {
            cartContent = JSON.parse(anonymousCart)
            let bookExists = false
            cartContent.books.forEach(item => {
                if (item.bookID === bookID) {
                    item.amount++
                    bookExists = true
                }

            })
            if (!bookExists) {
                cartContent.books.push({ amount: 1, bookID })
            }

        } else {
            cartContent = {
                books: [
                    {
                        amount: 1,
                        bookID
                    }
                ]
            }
        }
        alert("Book was added to your cart")
        window.localStorage.setItem('anonymousCart', JSON.stringify(cartContent))
    })
    return buttonContainer
}


