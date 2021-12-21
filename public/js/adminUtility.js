function chooseVisibleSection(divSection) {
    loginScreen.classList.add('closed')
    loader.classList.add('closed')
    management.classList.add('closed')
    divSection.classList.remove('closed')
}

function chooseFormMode(mode){
    const modeTextTranslator = {"new-book":"New Book","edit-book":"Edit Book","delete-book":"Delete Book"}
    bookEditor.className = "book-change-form"
    bookEditor.classList.add(mode)
    formHeader.className = "js-form-type title"
    formHeader.classList.add(mode)
   
    formHeader.textContent = modeTextTranslator[mode]
    if(mode!=="new-book")
    bookFields.forEach(item => {
        if (item.id === 'id')
            item.parentNode.classList.remove('disabled')
    })
    else
    bookFields.forEach(item => {
        if (item.id === 'id')
            item.parentNode.classList.add('disabled')
    })


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

function generateBookButton(book) {
    const bookContainer = generateBook(book)
    const bookButton = document.createElement('button')
    bookButton.addEventListener('click', (event) => {

        const bookContainer = event.currentTarget.lastChild

        for (let i = 0; i < bookFields.length; i++)
            for (let j = 0; j < bookContainer.children.length; j++)
                if (bookFields[i].id === bookContainer.children[j].className)
                    bookFields[i].value = bookContainer.children[j].textContent

        let imageInput
        for (let i = 0; i < bookFields.length; i++) {
            if (bookFields[i].id === 'image')
                imageInput = i
        }

        for (let i = 0; i < event.target.children.length; i++) {
            if (bookContainer.children[i].className === "book-cover-image-container")
                bookFields[imageInput].value = bookContainer.children[i].lastChild.src
        }
    })

    bookButton.appendChild(bookContainer)
    return bookButton
}

async function addNewBook() {
    try {
        const newBook = {}
        let resultBook
        let validBook = true
        bookFields.forEach(item => {
            if (validateInput(item.id, item.value))
                newBook[item.id] = item.value
            else {
                newBook[item.id + ":error"] = `${item.value} is not a valid ${item.id}`
                validBook = false
            }

        })
        if (validBook) {
            resultBook = await addBookRequest(newBook)
            resultDiv.innerHTML = ""
            resultDiv.append(generateBookButton(resultBook))
            bookFields.forEach(item => {
                item.value = ""
            })
        }
        else
            resultDiv.textContent = JSON.stringify(newBook)
    } catch (err) {
        throw err
    }
}

async function editBook() {
    try {
        const editedBook = {}
        let validBook = true
        let resultBook
        bookFields.forEach(item => {
            if (validateInput(item.id, item.value))
                editedBook[item.id] = item.value
            else {
                editedBook[item.id + ":error"] = `${item.value} is not a valid ${item.id}`
                validBook = false
            }

        })
        if (validBook) {
            let resultBook = await editBookRequest(editedBook)
            resultDiv.innerHTML = ""
            resultDiv.append(generateBookButton(resultBook))
            bookFields.forEach(item => {
                item.value = ""
            })
        }
        else
            resultDiv.textContent = JSON.stringify(newBook)
    } catch (err) {
        throw err
    }
}

async function deleteBook() {
    try {
        let bookID = ""
        let resultBook
        bookFields.forEach(item => {
            if (item.id === 'id')
            bookID = item.value
        })
        if ( bookID !== "") {
            resultBook = await deleteBookRequest(bookID)
            resultDiv.innerHTML = ""
            resultDiv.append(generateBookButton(resultBook))
        }
        else
            resultDiv.innerHTML = "No book was chosen"

    } catch (err) {
        throw err
    }
}

function changeFormStatus(newFormStatus) {
    bookEditor.className = "book-change-form"
    bookEditor.classList.add(newFormStatus)
    formHeader.className = "js-form-type title"
    formHeader.classList.add(newFormStatus)
    switch (newFormStatus) {
        case "new-book": {
            formHeader.textContent = "New Book"
            break;
        }
        case "edit-book": {
            formHeader.textContent = "Edit Book"
            break;
        }
        case "delete-book": {
            formHeader.textContent = "Delete Book"
            break;
        }
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

async function generateAllBooks(){
    try{
        const books = await getAllBooksRequest()
        if(books.length===0) return  resultDiv.textContent = "No books found"

        resultDiv.innerHTML=""
        books.forEach(item => {
            resultDiv.append(generateBookButton(item))
        })


    }catch(err){
        throw err
    }
}

function clearFormFields(){
    bookFields.forEach(item => {
        item.value = ""
    })
}




