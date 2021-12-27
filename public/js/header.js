const homeButton = document.querySelector('.js-home-button')
const userPageLink = document.querySelector('.js-user-page')
const logInText = document.querySelector('.js-log-in-text')
const userNameDiv = document.querySelector('.js-user-name')
let isLoggedIn = false

homeButton.addEventListener("click", (event) => {
    event.preventDefault()
    saveState({
        pageNumber: 0,
        searchTerm: "",
        booksOnPage: 0
    })
    window.location.href = "/"
})

userPageLink.addEventListener("click", (event) => {
    event.preventDefault()
    if (!isLoggedIn)
        window.location.href = "/user"
    logOut()




})

