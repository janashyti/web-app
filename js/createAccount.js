async function fetchUsingDataFromForm(){
    const h1 = document.querySelector("h1")
    const url = "https://janas-api-server.azurewebsites.net/user"
    const input = document.getElementById('formData')
    const data = {
        code: input.value
    }


const options = {
    method: "POST",
    headers: {"Content-Type": "application/json" },
    body: JSON.stringify(data)

} 

let response = await fetch(url, options)

if (response.status == 201){
    const obj = await response.json()
    h1.innerHTML = obj.message
    h1.innerHTML = "Thank you for signing up! You will get a verification email soon after!"
}
else if (response.status == 400){
    h1.innerHTML = "Server error"
    setTimeout(() => {
        location.href = "index.html"
    }, 2000)
}
}

document.querySelector("#submitButton").addEventListener("click", fetchUsingDataFromForm)
//fetchUsingDataFromForm()