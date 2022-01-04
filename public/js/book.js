const bookPage = document.querySelector(".js-book-page")
const bookID = getBookIdFromURL(window.location.href)
let bookObject 

getBookRequest(bookID).then(result => {
    bookObject = result
    generateBookPage(result)

}).catch(err => {
    console.log(err);
})

function getBookIdFromURL(url) {
    const partsOfUrl = url.split('/');
    return partsOfUrl[partsOfUrl.length - 1]
}

function generateBookPage(bookObject){
    const bookHeader = bookObject.name
    document.title = bookHeader

    const bookCoverContainer = document.createElement('div')
    bookCoverContainer.className ="cover-container"
    const bookCover = document.createElement('img')
    bookCover.src = bookObject.image
    bookCoverContainer.append(bookCover)
    bookPage.append(bookCoverContainer)  

    const mainContainer = document.createElement('div')
    mainContainer.className = "main-container"
    const bookPageHeader = document.createElement('h1')
    bookPageHeader.innerHTML = bookHeader
    mainContainer.append(bookPageHeader)

    const mainMold = {
        'description': 'description',
        'author': 'author',
        'numberofpages': 'numberofpages',
    }

    let propertyDiv
    for (const key in mainMold) {
        propertyDiv = document.createElement('div')
        propertyDiv.className = mainMold[key]
        propertyDiv.textContent = bookObject[key]
        mainContainer.append(propertyDiv)  
    }
    
    const orderBookContainer = document.createElement('div')
    orderBookContainer.className = "order-container"
    const priceDiv = document.createElement('div')
    priceDiv.className ="price-div"
    priceDiv.textContent = bookObject.price + " NIS"
    const buttonContainer = generateAddToCartButton(bookID)
    orderBookContainer.append(priceDiv)
    orderBookContainer.append(buttonContainer)

    bookPage.append(bookCoverContainer)
    bookPage.append(mainContainer)
    bookPage.append(orderBookContainer)
}