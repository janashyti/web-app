document.addEventListener('DOMContentLoaded', function () {
    //const createAccountModal = document.getElementById('id01');
    //const createAccountBtn = document.getElementById('submitButton');
   // const closeBtn = document.getElementsByClassName('close')[0];
    const createAccountForm = document.getElementById('submitButton');
    const message = document.getElementById('message');

    


createAccountForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const psw = document.getElementById('psw').value;
    const pswRepeat = document.getElementById('psw-repeat').value;
    const major = document.getElementById('school').value;
    const school = document.getElementById('major').value;
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

    if (psw !== psw-repeat) {
        message.textContent = 'Passwords do not match.';
        message.style.color = 'red';
    } else {
        createAccount(userData);
    }
});

async function createAccount(userData) {
    const mssg = document.querySelector("#message");
    const url = "https://janas-api-server.azurewebsites.net/user";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            try {
                const data = await response.json();
                mssg.innerHTML = data.message;
                message.textContent = 'Verification email has been sent to ' + userData.email;
                message.style.color = 'green';
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




});


















