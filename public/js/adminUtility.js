function getBookIdFromButton(objectID) {
    const idAsArray = objectID.split('-')
    return idAsArray[idAsArray.length - 1]
}

function getActionFromButton(objectID) {
    const idAsArray = objectID.split('-')
    return idAsArray[0]
}

function chooseVisibleSection(divSection) {
    loginScreen.classList.add('closed')
    loader.classList.add('closed')
    management.classList.add('closed')
    divSection.classList.remove('closed')
}

async function renderManagementScreenIfLoggedIn() {
    try {
        chooseVisibleSection(loader)
        const signedIn = await checkIfSignedIn()
        if (!signedIn) throw new Error('not signed in')
        await new Promise(resolve => setTimeout(resolve, 800))
        chooseVisibleSection(management)
    } catch (err) {
        throw err
    }
}

function generateManagementButton(id, className) {
    const managementButton = document.createElement('div')
    managementButton.className = className
    managementButton.classList.add('js-book-button')
    managementButton.id = `${className}-${id}`
    managementButton.addEventListener('click', event => {
        let bookId = getBookIdFromButton(event.currentTarget.id)
        let action = getActionFromButton(event.currentTarget.id)
        let formConfig = setFormConfigTo(action)
        changeForm(formConfig, bookId)
        modalBackdrop.classList.add('open')
        modalBox.classList.add('open')
    })
    switch (className) {
        case "edit":
            managementButton.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="edit" class="svg-inline--fa fa-edit fa-w-18"
                role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path fill="currentColor"
                    d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z">
                </path>
            </svg>`

            return managementButton
        case "delete": {
            managementButton.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash-alt"
                class="svg-inline--fa fa-trash-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="currentColor"
                    d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z">
                </path>
            </svg>`
            return managementButton
        }
        default:
            return;
    }

}

function exitModal() {
    modalBackdrop.classList.remove('open')
    modalBox.classList.remove('open')
}

function generateBook(book) {
    const bookContainer = document.createElement('div')
    bookContainer.classList.add('book-container')
    bookContainer.append(generateManagementButton(book._id, 'edit'))
    bookContainer.append(generateManagementButton(book._id, 'delete'))
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
    bookContainer.addEventListener('touchstart', event => {

        for (let i = 0; i < bookButtons.length; i++) {
            bookButtons[i].classList.remove('force-open')
        }

        const bookContainer = event.currentTarget
        bookContainer.childNodes.forEach(item => {
            if (item.classList.contains('js-book-button'))
                item.classList.add('force-open')
        })
    })
    return bookContainer
}

async function addBookToDB(event) {
    event.preventDefault()
    event.stopPropagation()

    try {
        const newBook = {}
        let resultBook
        let validBook = true
        bookFormInputFields.forEach(item => {
            if (validateInput(item.id, item.value))
                newBook[item.id] = item.value
            else {
                newBook[item.id + ":error"] = `${item.value} is not a valid ${item.id}`
                validBook = false
            }
        })
        if (validBook) {
            resultBook = await addBookRequest(newBook)
            modalResultContainer.innerHTML = ""
            modalResultContainer.append(generateBook(resultBook))
            modalForm.classList.add('closed')
            modalResultContainer.classList.remove('closed')
            await generateAllBooks()
        }
        else
            modalResultContainer.textContent = JSON.stringify(newBook)
    } catch (err) {
        throw err
    }
}

async function changeBookInDB(event) {
    event.preventDefault()
    event.stopPropagation()
    try {
        const editedBook = {}
        let validBook = true
        bookFormInputFields.forEach(item => {
            if (validateInput(item.id, item.value))
                editedBook[item.id] = item.value
            else {
                editedBook[item.id + ":error"] = `${item.value} is not a valid ${item.id}`
                validBook = false
            }

        })
        if (validBook) {
            let resultBook = await editBookRequest(editedBook)
            modalResultContainer.innerHTML = ""
            modalResultContainer.append(generateBook(resultBook))
            modalForm.classList.add('closed')
            modalResultContainer.classList.remove('closed')
            await generateAllBooks()
        }
        else
            modalResultContainer.textContent = JSON.stringify(newBook)
    } catch (err) {
        throw err
    }
}

async function deleteBookFromDB(event) {
    event.preventDefault()
    event.stopPropagation()
    try {
        let bookID = ""
        let resultBook
        bookFormInputFields.forEach(item => {
            if (item.id === 'id')
                bookID = item.value
        })
        if (bookID !== "") {
            resultBook = await deleteBookRequest(bookID)
            modalResultContainer.innerHTML = ""
            modalResultContainer.append(generateBook(resultBook))
            modalForm.classList.add('closed')
            modalResultContainer.classList.remove('closed')
            await generateAllBooks()
        }
        else
            modalResultContainer.innerHTML = "No book was chosen"

    } catch (err) {
        throw err
    }
}

function validateInput(id, value) {

    switch (id) {
        case 'name': return value.length > 0 ? true : false
        case 'image': {
            const urlRegex = /^(?:(?:(?<protocol>(?:http|https)):\/\/)?(?:(?<authority>(?:[A-Za-z](?:[A-Za-z\d\-]*[A-Za-z\d])?)(?:\.[A-Za-z][A-Za-z\d\-]*[A-Za-z\d])*)(?:\:(?<port>[0-9]+))?\/)(?:(?<path>[^\/][^\?\#\;]*\/))?)?(?<file>[^\?\#\/\\]*\.(?<extension>[Jj][Pp][Ee]?[Gg]|[Pp][Nn][Gg]|[Gg][Ii][Ff]))(?:\?(?<query>[^\#]*))?(?:\#(?<fragment>.*))?$/
            return urlRegex.test(value)
        }
        case 'price': return true
        case 'author': return true
        case 'description': return true
        case 'numberofpages': return true
        case 'id': return true
    }
}

function generateAddBookButton() {
    const addBookButton = document.createElement('div')
    addBookButton.classList.add('book-container')
    addBookButton.innerHTML =
        `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus fa-w-14"
    role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path fill="currentColor"
        d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z">
    </path>
</svg>`
    const newBook = addBookButton.lastChild
    newBook.classList.add('js-add-new-book')
    newBook.classList.add('add-new-book')
    newBook.addEventListener('click', () => {
        const formConfig = setFormConfigTo('add')
        changeForm(formConfig)
        modalBackdrop.classList.add('open')
        modalBox.classList.add('open')
    })
    const buttonText = document.createElement('div')
    buttonText.textContent = "New Book"
    addBookButton.append(buttonText)
    return addBookButton
}

async function generateAllBooks() {
    try {
        const books = await getAllBooksRequest()
        resultDiv.innerHTML = ""
        resultDiv.append(generateAddBookButton())
        if (books.length === 0) return

        books.forEach(item => {
            let bookHTML = generateBook(item)
            booksData.push({ id: item._id, "bookObject": item, bookHTML })
            resultDiv.append(bookHTML)
        })


    } catch (err) {
        throw err
    }
}

function setInputFields(bookId) {
    let currentBook
    for (const book of booksData) {
        if (book.id === bookId)
            currentBook = book.bookObject
    }
    if (currentBook) {
        bookFormInputFields.forEach(item => {
            item.value = currentBook[item.id]
            if (item.id === "id")
                item.value = currentBook._id
        })

    }
}

function changeForm(formConfig, bookId) {
    modalForm.classList.remove('closed')
    modalResultContainer.classList.add('closed')
    bookFormTitle.textContent = formConfig.title
    
        bookFormInputFields.forEach(item => {
            item.value = ""
            item.disabled = formConfig.disableInput
        })

    if (!formConfig.showId)
        bookFormIdContainer.classList.add('close')
    else
        bookFormIdContainer.classList.add('close')

    if (formConfig.fillFields)
        setInputFields(bookId)

    bookFormSubmitButton.textContent = formConfig.submitButtonText
    bookFormSubmitButton.removeEventListener('click', addBookToDB)
    bookFormSubmitButton.removeEventListener('click', changeBookInDB)
    bookFormSubmitButton.removeEventListener('click', deleteBookFromDB)

    switch (formConfig.submitButtonAction) {
        case "add":
            bookFormSubmitButton.addEventListener('click', addBookToDB)
            break;
        case "edit":
            bookFormSubmitButton.addEventListener('click', changeBookInDB)
            break;
        case "delete":
            bookFormSubmitButton.addEventListener('click', deleteBookFromDB)
            break;
        default:
            break;
    }
}

function setFormConfigTo(formMode) {
    const formConfig = {
        formMode: "",
        title: "",
        submitButtonText: "",
        submitButtonAction: "",
        showId: false,
        disableInput: false,
        fillFields: false
    }
    switch (formMode) {
        case "add":
            formConfig.formMode = formMode
            formConfig.title = "New Book"
            formConfig.submitButtonText = "Save new book"
            formConfig.submitButtonAction = "add"
            formConfig.showId = false
            formConfig.disableInput = false
            formConfig.fillFields = false
            return formConfig

        case "edit":
            formConfig.formMode = formMode
            formConfig.title = "Edit Book"
            formConfig.submitButtonText = "Save changes"
            formConfig.submitButtonAction = "edit"
            formConfig.showId = true
            formConfig.disableInput = false
            formConfig.fillFields = true
            return formConfig

        case "delete":
            formConfig.formMode = formMode
            formConfig.title = "Delete Book"
            formConfig.submitButtonText = "Delete Book"
            formConfig.submitButtonAction = "delete"
            formConfig.showId = true
            formConfig.disableInput = true
            formConfig.fillFields = true
            return formConfig
            

        default:

            return null
    }
}




