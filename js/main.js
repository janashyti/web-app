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
var modal = document.getElementById('meetingTimesModal');

console.log('loading')

//function closeMe() {
  //  document.querySelector('#meetingTimesModal').style.display = "none";
  //}

 let times = [{}];
 console.log("oni: " + times);
    document.querySelector("#sendMeetingTimes").addEventListener('click', async function (event) {
    console.log("jana")
    let day = document.getElementById('day').value;
    let time = document.getElementById('time').value;
    let location = document.getElementById('location').value;
    times.push({day, time, location});
    console.log(times)
    document.querySelector('#day').value = undefined;
    document.querySelector('#time').value = undefined;
    document.querySelector('#location').value = undefined;
    
}); 
times.splice(0,1)


document.querySelector("#createStudyGroupButton").addEventListener('click', async function (event) {
    //event.preventDefault();
    console.log('test1')

    const name = document.getElementById('name').value;
    const owner = document.getElementById('owner').value;
    const is_public = document.getElementById('is_public').value;
    const max_participants = document.getElementById('max_participants').value;
    let start_date = document.getElementById('start_date').value;
    let end_date = document.getElementById('end_date').value;
    let day = document.getElementById('day').value;
    let time = document.getElementById('time').value;
    let location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    const school = document.getElementById('school').value;
    const course_number = document.getElementById('course_number').value;
    const participants = document.getElementById('participants').value;

    if(start_date == false){
        start_date = undefined;
    }

    if(end_date == false){
        end_date = undefined;
    }

    //const isTrue = (time) ? true : false
    //console.log(`***${time}*** isTrue: ${isTrue}`) 
    


    const studyGroupData = {
        name: name,
        owner: owner,
        is_public: is_public,
        max_participants: max_participants,
        start_date: start_date,
        end_date: end_date,
        meeting_times: times,
        description: description,
        school: school,
        course_number: course_number,
        participants: [participants]
    };

    if(time == false || day == false || location == false){
        const studyGroupData2 = {
            name: name,
            owner: owner,
            is_public: is_public,
            max_participants: max_participants,
            start_date: start_date,
            end_date: end_date,
            description: description,
            school: school,
            course_number: course_number,
            participants: [participants]
        };
        createStudyGroup(studyGroupData2);
    }

    else{
     createStudyGroup(studyGroupData);
    }
});


async function createStudyGroup(studyGroupData) {
    const mssg = document.querySelector("p");
    const url = "https://janas-api-server.azurewebsites.net/studygroup";
    const token = localStorage.getItem("token");
    console.log('test3')
    console.log(studyGroupData)
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studyGroupData)
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
                location.href = "main.html";
            } catch (error) {
                console.error('Error parsing JSON response:', error.message);
                // Ignore error parsing JSON
                 mssg.style.color = 'green';
                 location.href = "main.html";
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
