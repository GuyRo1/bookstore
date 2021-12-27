function generateAddToCartButton(bookID) {
    const buttonContainer = document.createElement('div')
    buttonContainer.className = "button-container"
    const button = document.createElement('button')
    button.textContent = `Add to Cart`
    button.className = "add-to-cart"
    buttonContainer.id = `add-to-cart-${bookID}`
    buttonContainer.appendChild(button)
    buttonContainer.addEventListener('click', async (event) => {
        event.stopPropagation()
        event.preventDefault()
        const bookID = event.currentTarget.id.replace('add-to-cart-', '')
        if (isLoggedIn) {
            try {
                await addBookToCart({ id: bookID, amount: 1 })
                alert("Book was added to your cart")
                return
            } catch (err) {
                console.log(err);
                return
            }
        }
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


function saveState(state) {
    const sessionStorage = window.sessionStorage
    sessionStorage.setItem('state', JSON.stringify(state))
}


function loadState() {
    const stateAsString = window.sessionStorage.getItem('state')
    const state = JSON.parse(stateAsString) || {}
    state.pageNumber = state.pageNumber || 1
    state.searchTerm = state.searchTerm || ""
    state.booksOnPage = state.booksOnPage || 3
    return state
}

const loggedInAs = userName => {
    userNameDiv.classList.remove('close')
    logInText.textContent = "log out"
    userNameDiv.innerHTML = `Welcome,&nbsp ${userName}`
    isLoggedIn = true
}

const logOut = () => {
    window.localStorage.removeItem('user-token')
    logInText.textContent = "login"
    userNameDiv.classList.add('close')
    userNameDiv.textContent = ""
    isLoggedIn = false
}

async function setUserStatus() {
    try {
        const user = await checkIfUserLoggedIn()
        if (!user) return null
        return user.username
    } catch (err) {
        throw err
    }

}





