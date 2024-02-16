const token = localStorage.getItem("token");

console.log("token: " + token)


document.querySelector("#logoutButton").addEventListener('click', async () => {

    console.log("logout")

    const url = "https://janas-api-server.azurewebsites.net/user/logout"
    console.log(url)

    

    const data = {
        token
    }
    console.log(data)

    const body = JSON.stringify(data)
    console.log(body)

    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": 'application/json'
        },
        body
    }

    console.log('calling fetch')

    let response = await fetch(url, options)

    console.log(response)
    console.log(response.status)

    console.log('fetch returned')

    if (response.status === 200) {
        console.log("logged out successfully.")
        const body = await response.json();
        console.log(body)
        console.log(JSON.stringify(body.user))

        localStorage.deleteItem("user", JSON.stringify(body.user));
        localStorage.deleteItem("token", body.token);

        location.href = "index.html"
    }
    else {
        console.log("error logging out")
        document.querySelector("p").innerHTML = "IServer Error"
    }

    await sleepNow(3)

    emailLogout.value = ''
    passwordLogout.value = ''
    document.querySelector("p").innerHTML = ''


})










