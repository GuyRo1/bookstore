const formHeader = document.querySelector('.js-form-header')
const submitButton = document.querySelector('.js-submit-button')
const changeMode = document.querySelector('.js-change-mode')
const mainLoginScreen = document.querySelector('.js-user-login')
const alertMessage = document.querySelector('.js-alert-message')
const password = document.querySelector('#password')
const userName = document.querySelector('#user-name')
const originalLoginScreen = mainLoginScreen.innerHTML

let currentMode = "logIn"
const modes = {
    logIn: {
        header: "Log In",
        changeModeText: "Create an account",
        submitButton: "Log In"
    },
    registration: {
        header: "Sign Up",
        changeModeText: "Got an account? Log In",
        submitButton: "Sign Up"
    }
}

changeMode.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (currentMode !== "logIn") {
        formHeader.textContent = modes.logIn.header
        changeMode.textContent = modes.logIn.changeModeText
        submitButton.textContent = modes.logIn.submitButton
        currentMode = "logIn"
    } else {
        formHeader.textContent = modes.registration.header
        changeMode.textContent = modes.registration.changeModeText
        submitButton.textContent = modes.registration.submitButton
        currentMode = "registration"
    }
})

submitButton.addEventListener('click', async (event) => {
    try {
        event.preventDefault()
        event.stopPropagation()
        const userNameValue = document.querySelector('#user-name').value
        const passwordValue = document.querySelector('#password').value

        if (currentMode === "logIn") {
            await logInUser(userNameValue, passwordValue)
            alertMessage.className = "success"
            changeAlertMessage("success", `${userNameValue}, you are logged in`)
            loggedInAs(userNameValue)
        } else {
            await registerUser(userNameValue, passwordValue)
            await logInUser(userNameValue, passwordValue)
            changeAlertMessage("success", `Welcome ${userNameValue}, you are logged in`)
            loggedInAs(userNameValue)
        }

    } catch (err) {
        console.log(err)
        changeAlertMessage("error", err)
    }
})

async function initializePage() {
    try {
        const userName = await setUserStatus()
        if (userName)
            loggedInAs(userName)
    } catch (err) {
        throw err;
    }
}



initializePage().then().catch(err => {
    console.log(err);
})

