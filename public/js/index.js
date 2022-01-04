const backButton = document.querySelector('.js-back-button')
const forwardButton = document.querySelector('.js-forward-button')
const booksContainer = document.querySelector('.js-books-container')
const pageIndicator = document.querySelector('.js-page-indicator')
const searchBar = document.querySelector('.js-search-bar')
let searchStart
let loadedBooks = {}
let state = {
    pageNumber: 0,
    searchTerm: "",
    booksOnPage: 0
}

searchBar.addEventListener('keyup', () => {
    clearTimeout(searchStart)

    searchStart = setTimeout(() => {
        disableInput()
        state = setSearchTerm(state, searchBar.value)
        setBooksData(state)
            .then(result => {
                loadedBooks = result
                setPagesNavigationButtons(state.pageNumber, loadedBooks.firstPage, loadedBooks.lastPage)
                showDataOnPage(loadedBooks, state.pageNumber)
                enableInput()
                searchBar.focus()
                saveState(state)
            }).catch(err => {
                console.log(err);
            })
    }, 500)
})

forwardButton.addEventListener('click', () => {
    nextPage(loadedBooks, 1)
    saveState(state)
})

backButton.addEventListener('click', () => {
    nextPage(loadedBooks, -1)
    saveState(state)
})

async function initializePage() {
    try {
        const userName = await setUserStatus()
        if (userName)
            loggedInAs(userName)
        state = loadState(state)
        loadedBooks = await setBooksData(state)
        setPagesNavigationButtons(state.pageNumber, loadedBooks.firstPage, loadedBooks.lastPage)
        setInitialInput(state)
        showDataOnPage(loadedBooks, state.pageNumber)
    } catch (err) {
        throw err;
    }
}

initializePage().then().catch(err => {
    console.log(err);
})


