async function userLogIn(userName, password) {
    try {
        const credentials = { userName, password }
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json()

        if (data.status === 200)
            return data.token
        throw { message: "Invalid user name or password" }

    } catch (err) {
        throw err
    }

}

async function userRegistration(userName, password) {
    try {
        const response = await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName, password })
        });

        let data = await response.json()
        if (data.status !== 201)
            throw new Error("could not register user")
        return data
    } catch (err) {
        throw err
    }
}



