function generateBook(book) {
    const bookContainer = document.createElement('div')
    bookContainer.classList.add('book-container')
    const bookImageContainer = document.createElement('div')
    bookImageContainer.classList.add('book-cover-image-container')
    const bookImage = document.createElement('img')
    bookImage.src = book.image
    bookImageContainer.append(bookImage)
    bookContainer.append(bookImageContainer)
    const bookMold = {
        '_id': 'id',
        'name': 'name',
        'description': 'description',
        'author': 'author',
        'numberofpages': 'numberofpages',
        'price': 'price'
    }
    for (const property in bookMold) {
        let bookPropertyNode = document.createElement('div')
        bookPropertyNode.classList.add(bookMold[property])
        bookPropertyNode.textContent = book[property]
        bookContainer.append(bookPropertyNode)
    }
    bookContainer.id = book._id
    return bookContainer
}

async function getBooks(searchParams) {
    try {
        let queryString = "?"
        let paramToString = (key, value) => `${key}=${value}&`
        for (const key in searchParams) {
            queryString = queryString.concat(paramToString(key, searchParams[key]))
        }
        return await getAllBooksRequest(queryString)
    } catch (err) {
        throw err
    }
}

async function getBooksForPage(pageNumber, booksInPage) {
    try {
        const numberofpages = 20
        const startingPage = pageNumber <= numberofpages ? 1 : pageNumber - minimumPages + 1
        const skip = (startingPage - 1) * booksInPage
        const searchParams = {}
        searchParams.skip = skip
        searchParams.limit = numberofpages * booksInPage
        const data = await getBooks(searchParams)
        return { startingPage, data }
    } catch (err) {
        throw err
    }
}

function setSearchTerm(state, searchTerm) {
    state.searchTerm = searchTerm
    return state
}

async function getBooksForSearch(searchTerm) {
    try {
        const searchParams = {}
        searchParams.nameContains = searchTerm
        const data = await getBooks(searchParams)
        return { startingPage: 1, data }
    } catch (err) {
        throw err
    }
}

async function setBooksData(state) {

    try {
        let result = {}
        const loadedBooks = {
            prev: true,
            next: true,
            pages: [],
            firstPage: 0,
            lastPage: 0
        }

        if (state.searchTerm === "")
            result = await getBooksForPage(state.pageNumber, state.booksOnPage)
        else
            result = await getBooksForSearch(state.searchTerm)

    
        let counter = result.startingPage

        for (let i=0; i < result.data.length; i++) {
            if (i % state.booksOnPage === 0) {
                loadedBooks.pages.push({ pageNumber: counter, books: [] })
                counter++
            }


            loadedBooks.pages[loadedBooks.pages.length - 1].books.push({ bookObject: result.data[i], bookHTML: generateBook(result.data[i]) })
        }

        loadedBooks.firstPage = result.startingPage
        loadedBooks.lastPage = counter - 1


        return loadedBooks
    } catch (err) {
        throw err
    }
}

function showDataOnPage(loadedBooks, pageNumber) {
    booksContainer.innerHTML = ""
    if (!loadedBooks.prev) backButton.classList.add("close")
    if (!loadedBooks.next) forwardButton.classList.add("close")
    if (loadedBooks.prev) backButton.classList.remove("close")
    if (loadedBooks.next) forwardButton.classList.remove("close")
    for (let i = 0; i < loadedBooks.pages.length; i++) {
        if (loadedBooks.pages[i].pageNumber === pageNumber) {
            const books = loadedBooks.pages[i].books
            books.forEach(book => {
                booksContainer.appendChild(setBookInsideLink(book.bookHTML))
            })
        }
    }
    if(booksContainer.innerHTML==="")
    booksContainer.innerHTML = "No Books"
}

function setBookInsideLink(bookHTML) {
    const link = document.createElement('a')
    link.href = `book/${bookHTML.id}`
    link.append(bookHTML)
    return link
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
    state.booksOnPage = state.booksOnPage || 5
    return state
}

function nextPage(loadedBooks, delta) {

    disableInput()
    const newPage = state.pageNumber + delta
    if (newPage >= loadedBooks.firstPage && newPage <= loadedBooks.lastPage) {
        state.pageNumber = newPage
        setPagesNavigationButtons(state.pageNumber, loadedBooks.firstPage, loadedBooks.lastPage)
        showDataOnPage(loadedBooks, state.pageNumber)
        enableInput()
    }

    else {
        enableInput()
        console.log("Something went terribly wrong next and prev pages should be loaded in advance");
    }
    if (state.searchTerm === "")
        if ((state.pageNumber > 10 && state.pageNumber > state.firstPage + 10) || state.pageNumber + 1 >= state.lastPage)
            setBooksData(state)
                .then(result => {
                    loadedBooks = result
                    setPagesNavigationButtons(state.pageNumber, loadedBooks.firstPage, loadedBooks.lastPage)
                    showDataOnPage(loadedBooks, state.pageNumber)
                }).catch(err => {
                    console.log(err);
                })


}

function setPagesNavigationButtons(pageNumber, firstPage, lastPage) {
    
    if (pageNumber <= firstPage)
        loadedBooks.prev = false
    else
        loadedBooks.prev = true
    if (pageNumber >= lastPage)
        loadedBooks.next = false
    else
        loadedBooks.next = true

    if(loadedBooks.next||loadedBooks.prev)
    pageIndicator.textContent = pageNumber
    else
    pageIndicator.textContent =""
}

function setInitialInput(state){
    searchBar.value = state.searchTerm
}

function disableInput() {
    searchBar.disabled = true
    backButton.classList.add('disabled')
    forwardButton.classList.add('disabled')
}

function enableInput() {
    searchBar.disabled = false
    backButton.classList.remove('disabled')
    forwardButton.classList.remove('disabled')
}