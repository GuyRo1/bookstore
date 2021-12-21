const loginScreen = document.querySelector('.login')
const loader = document.querySelector('.loading')
const management = document.querySelector('.management')
const loginButton = document.querySelector('#login-button')
const doCurrentAction = document.querySelector('#save_book');
const getBooks = document.querySelector('#get_books');
const resultDiv = document.querySelector('.books-container')
const bookFields = document.querySelectorAll('.js_new_book_input')
const bookList = document.getElementsByClassName('book-container')
const bookEditor = document.querySelector('.book-change-form')
const formHeader = document.querySelector('.js-form-type')
const addBookMode = document.querySelector('#add-book')
const editBookMode = document.querySelector('#edit-book')
const deleteBookMode = document.querySelector('#delete-book')
const clearFields = document.querySelector('#clear')

loginButton.addEventListener('click', async event => {
    try {
        event.preventDefault()
        const userName = document.querySelector('#user-name').value
        const password = document.querySelector('#password').value

        chooseVisibleSection(loader)

        await new Promise(resolve => setTimeout(resolve, 800))

        const token = await adminLogin(userName, password)
        if (!token) {
            console.log("can not log in");
            chooseVisibleSection(loginScreen)
        }
        else {
            chooseVisibleSection("management")
        }
    } catch (err) {
        console.log("can not log in");
        chooseVisibleSection(loginScreen)
    }

})

clearFields.addEventListener('click', event => {
    event.preventDefault()
    clearFormFields()
})

addBookMode.addEventListener('click', async event => {
    event.preventDefault()
    chooseFormMode("new-book")
})

editBookMode.addEventListener('click', async event => {
    event.preventDefault()
    chooseFormMode("edit-book")
})

deleteBookMode.addEventListener('click', async event => {
    event.preventDefault()
    chooseFormMode("delete-book")
})

doCurrentAction.addEventListener('click', async event=>{
    event.preventDefault()
    resultDiv.textContent="loading..."
    if (bookEditor.classList.contains('new-book'))
        await addNewBook()
    else if (bookEditor.classList.contains('edit-book'))
        await editBook()
    else if (bookEditor.classList.contains('delete-book'))
        await deleteBook()
})

getBooks.addEventListener('click', async event=>{
    resultDiv.innerHTML = "loading..."
    await generateAllBooks()
})











renderManagementScreenIfLoggedIn().then().catch(err => {
    console.log("need to log in")
    setTimeout((chooseVisibleSection(loginScreen)), 800)

})