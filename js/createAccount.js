const token = localStorage.getItem("token");
console.log("token: " + token)

//if (token) {
//location.href="main.html"
//}

console.log(createAccountButton)

const message = document.querySelector("p");

// Get the modal
var modal = document.getElementById('id01');
var modal2 = document.getElementById('id02');


console.log('loading')


document.querySelector("#createAccountButton").addEventListener('click', async function (event) {
    //event.preventDefault();
    console.log('test1')

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const psw = document.getElementById('psw').value;
    const pswRepeat = document.getElementById('psw-repeat').value;
    const major = document.getElementById('major').value;
    const school = document.getElementById('school').value;
    //const profile_pic = document.getElementById('profile_pic').value;

    const userData = {
        email: email,
        username: username,
        password: psw,
        confirmPassword: pswRepeat,
        major: [major],
        school: school,
        //profile_pic: profile_pic,
    };

    if (psw !== pswRepeat) {
        message.textContent = 'Passwords do not match.';
        message.style.color = 'red';
    } else {
        console.log('test2')
        createAccount(userData);
    }
});

async function createAccount(userData) {
    const mssg = document.querySelector("p");
    const url = "https://janas-api-server.azurewebsites.net/user";
    console.log('test3')
    console.log(userData)
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
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
                message.textContent = 'Verification email has been sent to ' + userData.email;
                message.style.color = 'green';
                location.href = "email.html"
            } catch (error) {
                console.error('Error parsing JSON response:', error.message);
                // Ignore error parsing JSON
                mssg.innerHTML = 'Verification email has been sent to ' + userData.email;
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

const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay * 1000))

document.querySelector("#loginButton").addEventListener('click', async () => {

    console.log("login")

    const url = "https://janas-api-server.azurewebsites.net/user/login"
    console.log(url)

    const emailLogin = document.querySelector("#emailLogin")
    console.log(emailLogin.value)
    const passwordLogin = document.querySelector("#pswLogin")
    console.log(passwordLogin.value)

    const data = {
        email: emailLogin.value,
        password: passwordLogin.value
    }
    console.log(data)

    const body = JSON.stringify(data)
    console.log(body)

    const options = {
        method: "POST",
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
        console.log("logged in successfully.")
        const body = await response.json();
        console.log(body)
        console.log(JSON.stringify(body.user))

       // export const user_id = JSON.stringify(body.user);
        localStorage.setItem("user", JSON.stringify(body.user));
        localStorage.setItem("token", body.token);
        localStorage.setItem("user_id", body.user.json)

        location.href = "main.html"
    }
    else if (response.status === 401) {
        console.log('failed to log in')
        document.querySelector("p").innerHTML = "Email has not been validated."
    }
    else {
        console.log("error logging in")
        document.querySelector("p").innerHTML = "Invalid credentials."
    }

    await sleepNow(3)

    emailLogin.value = ''
    passwordLogin.value = ''
    document.querySelector("p").innerHTML = ''
})


