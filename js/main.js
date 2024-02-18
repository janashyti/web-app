const token = localStorage.getItem("token");

console.log("token: " + token)


document.querySelector("#logoutButton").addEventListener('click', async function (event) {

    console.log("logout")
    const token = localStorage.getItem("token");

    const url = "https://janas-api-server.azurewebsites.net/user/logout"
    console.log(url)

    

    const options = {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`}
    }


    let response = await fetch(url, options)

    console.log(response)
    console.log(response.status)

    console.log('fetch returned')

    if (response.status === 200) {
        console.log("logged out successfully.")
        localStorage.removeItem(token);
        location.href = "index.html"
    }
    else if (response.status === 401) {
        console.log('failed to log out')
        document.querySelector("p").innerHTML = "Could not log out."
    }

})
