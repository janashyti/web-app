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



console.log(createStudyGroupButton)

const message = document.querySelector("p");

// Get the modal
var modal = document.getElementById('createStudyGroupModule');


console.log('loading')


document.querySelector("#createStudyGroupButton").addEventListener('click', async function (event) {
    //event.preventDefault();
    console.log('test1')

    const name = document.getElementById('name').value;
    const owner = document.getElementById('owner').value;
    //const psw = document.getElementById('psw').value;
    const is_public = document.getElementById('is_public').value;
    const max_participants = document.getElementById('max_participants').value;
    //const school = document.getElementById('school').value;
    //const profile_pic = document.getElementById('profile_pic').value;

    const userData = {
        name: name,
        owner: owner,
        is_public: is_public,
        max_participants: max_participants,
    };

   
        createStudyGroup(userData);
});

async function createStudyGroup(userData) {
    const mssg = document.querySelector("p");
    const url = "https://janas-api-server.azurewebsites.net/studygroup";
    const token = localStorage.getItem("token");
    console.log('test3')
    console.log(userData)
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });
console.log("test4")
        if (response.ok) {
            console.log('test5')
            try {
                const data = await response.json();
                console.log(data)
                mssg.innerHTML = data.message;
                message.textContent = 'Thank you! Your study Group has been created!'
                message.style.color = 'green';
            } catch (error) {
                console.error('Error parsing JSON response:', error.message);
                // Ignore error parsing JSON
                 mssg.style.color = 'green';
            }
        } else {
            const errorData = await response.json();
            mssg.innerHTML = "Error: " + errorData.message;
            mssg.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error.message);
        mssg.innerHTML = "Error: " + error.message;
        mssg.style.color = 'red';
    }
}
