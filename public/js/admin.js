const loginScreen = document.querySelector('.login')
const loader = document.querySelector('.loading')
const management = document.querySelector('.management')
const loginButton = document.querySelector('#login-button')
const resultDiv = document.querySelector('.books-container')
const modalBackdrop = document.querySelector('.js-modal-backdrop')
const modalBox = document.querySelector('.js-modal-box')
const exitModalButton = document.querySelector('.js-exit-modal')
const bookFormTitle = document.querySelector('.js-title-form')
const bookFormInputFields = document.querySelectorAll('.js-book-form-input')
const bookFormIdContainer = document.querySelector('.js-book-id-container')
const bookFormSubmitButton = document.querySelector('.js-book-submit-button') 
const modalResultContainer = document.querySelector('.js-book-result-container')
const modalForm = document.querySelector('.js-book-form')
const bookButtons = document.getElementsByClassName('js-book-button')


let booksData = []


loginButton.addEventListener('click', async event => {
    try {
        event.preventDefault()
        const userName = document.querySelector('#user-name').value
        const password = document.querySelector('#password').value

        chooseVisibleSection(loader)

        await new Promise(resolve => setTimeout(resolve, 800))

        const token = await adminLogin(userName, password)
        if (!token) {

            chooseVisibleSection(loginScreen)
        }
        else {
            chooseVisibleSection(management)
            resultDiv.innerHTML = "loading..."
            generateAllBooks().then().catch(err => {
                console.log(err);
            })
        }
    } catch (err) {

        chooseVisibleSection(loginScreen)
    }

})

exitModalButton.addEventListener('click', exitModal)

renderManagementScreenIfLoggedIn().then(result => {
    generateAllBooks().then()
}).catch(err => {
    console.log("need to log in")
    setTimeout((chooseVisibleSection(loginScreen)), 800)
})