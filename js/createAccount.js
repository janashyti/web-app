async function fetchUsingDataFromForm(){
    //const mssg8 = document.querySelector("#message8")
    //const input = document.querySelector("#input8")
    const url = "https://janas-api-server.azurewebsites.net/user"
    const data = {
        code: InputDeviceInfo.value
    }


const options = {
    method: "POST",
    headers: {"Content-Type": "application/json" },
    body: JSON.stringify(data)

} 

let response = await fetch(url, options)

if (response.status == 200){
    const obj = await response.json()
    mssg8.innerHTML = obj.message
}
else if (response.status == 401){
    const obj = await response.json()
    mssg8.innerHTML = "ERROR: " + obj.message
}
else if (response.status == 400){
    mssg8.innerHTML = "Server error"
}
}

document.addEventListener("click", fetchUsingDataFromForm)