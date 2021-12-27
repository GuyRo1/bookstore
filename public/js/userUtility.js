async function registerUser(userName, password) {
    try {
        await userRegistration(userName, password);
    } catch (err) {
        throw err
    }
}

async function logInUser(userName, password) {
    try {
        const token = await userLogIn(userName, password)
        if (token) {
            window.localStorage.setItem('user-token', token)
            return
        } else {
            throw new { message: "Invalid user name or password" }
        }
    } catch (err) {
        throw err
    }
}

function generateMessageDiv(textContent) {
    const messageDiv = document.createElement('div')
    messageDiv.className = 'message-console'
    messageDiv.textContent = textContent
    return messageDiv
}

function changeAlertMessage(status, message) {
    alertMessage.className = `alert-message js-alert-message ${status}`
    alertMessage.textContent = message

}