const token = localStorage.getItem("token");
console.log("token: " + token)
const user = localStorage.getItem("user");
let realUserId
let user_id


        function createTable(finalArray) {
            let tableHTML = '<table border="1"><tr>';
            Object.keys(finalArray[0]).forEach(key => {
                tableHTML += `<th>${key}</th>`;
            });

            tableHTML += '</tr>';

            finalArray.forEach(item => {
                tableHTML += '<tr>';
                Object.values(item).forEach(value => {

                    tableHTML += `<td>${value}</td>`;

                });
                tableHTML += '</tr>';
            });
            tableHTML += '</table>';
            let space = document.querySelector("#notifications")
            space.innerHTML = tableHTML;
            
        }


document.querySelector("#logoutButton").addEventListener('click', async function (event) {

    console.log("logout")
    const token = localStorage.getItem("token");

    const url = "https://janas-api-server.azurewebsites.net/user/logout"
    console.log(url)



    const options = {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`
        }
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

document.querySelector("#myNotificationsButton").addEventListener('click', async function (event) {

    console.log("MyNOTIFICATIONS")
    const token = localStorage.getItem("token");
    console.log(token)
    let currentUser = JSON.parse(user)
    let id = currentUser._id
    console.log(id)
    

    const url = `https://janas-api-server.azurewebsites.net/notification/${id}`
    console.log(url)



    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }


    let response = await fetch(url, options)

    let data = []
    data = await response.json()

    for(let i = 0; i < data.length; i++){
        delete data[i]._id
        delete data[i].sender
        delete data[i].receiver
        delete data[i].is_read
    }
    

    console.log(data)
    console.log(response.status)

    if (response.status === 200) {
        createTable(data)
    }
    else if (response.status === 401) {
    }

})

const message = document.querySelector("p");

// Get the modal
var modal = document.getElementById('createStudyGroupModule');
var modal = document.getElementById('meetingTimesModal');

console.log('loading')

//function closeMe() {
//  document.querySelector('#meetingTimesModal').style.display = "none";
//}

let times = [];
console.log("oni: " + times);
document.querySelector("#sendMeetingTimes").addEventListener('click', async function (event) {
    console.log("jana")
    let day = document.getElementById('day').value;
    let time = document.getElementById('time').value;
    let location = document.getElementById('location').value;
    times.push({ day, time, location });
    console.log(times)
    document.querySelector('#day').value = undefined;
    document.querySelector('#time').value = undefined;
    document.querySelector('#location').value = undefined;

});



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

    if (start_date == false) {
        start_date = undefined;
    }

    if (end_date == false) {
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

    if (time == false || day == false || location == false) {
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

    else {
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
                //  console.error('Error parsing JSON response:', error.message);
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


document.querySelector("#searchButton").addEventListener('click', async () => {
    console.log("search")
    let url = `https://janas-api-server.azurewebsites.net/studygroups?`
    console.log(url)

    const owned = document.querySelector("#owned")
    console.log("OWned " + owned.value)
    const ongoing = document.querySelector("#ongoing")
    console.log(ongoing.value)
    const sortBy = document.querySelector("#sortBy")
    console.log(sortBy.value)
    const search = document.querySelector("#search")
    console.log(search.value)
    const skip = document.querySelector("#skip")
    console.log(skip.value)

    const studyGroupSearchData = {
        ongoing: ongoing.value,
        sortBy: sortBy.value,
        search: search.value,
        skip: skip.value
    }
    console.log(studyGroupSearchData)

    console.log("searching")

    const h1 = document.querySelector("h1")
    const p = document.querySelector("p")

    if (!token) {
        h1.innerHTML = "Something went wrong."
        p.innerHTML = "Please try again!"

        console.log("No token found")

        return
    }

    console.log("test")
    if (skip.value == "") {
        if (ongoing.value == "true" || ongoing.value == "false") {
            console.log("ongoing" + ongoing.value)
            if (sortBy.value === "asc" || sortBy.value === "desc") {
                url = `https://janas-api-server.azurewebsites.net/studygroups?ongoing=${ongoing.value}&sortBy=name:${sortBy.value}&limit=${5}`
                console.log(url)
                if (search.value != "") {
                    url = `https://janas-api-server.azurewebsites.net/studygroups?ongoing=${ongoing.value}&sortBy=name:${sortBy.value}&search=${search.value}&limit=${4}`
                    console.log(url)
                }
            }
            else if (search.value != "") {
                url = `https://janas-api-server.azurewebsites.net/studygroups?ongoing=${ongoing.value}&search=${search.value}&limit=${4}`
                console.log(url)
            }
            else url = `https://janas-api-server.azurewebsites.net/studygroups?ongoing=${ongoing.value}&limit=${4}`
            console.log(url)
        }

        else if (sortBy.value == "asc" || sortBy.value == "desc") {
            if (search.value == "") {
                url = `https://janas-api-server.azurewebsites.net/studygroups?sortBy=name:${sortBy.value}&limit=${4}`
                console.log(url)
            }
            else url = `https://janas-api-server.azurewebsites.net/studygroups?sortBy=name:${sortBy.value}&search=${search.value}&limit=${4}`
            console.log(url)
        }

        else if (ongoing.value == "" && sortBy.value == "" && search.value != "") {
            url = `https://janas-api-server.azurewebsites.net/studygroups?search=${search.value}&limit=${4}`
            console.log(url)
        }
    }



    else if (skip.value != "") {
        if (ongoing.value == "true" || ongoing.value == "false") {
            console.log("ongoing" + ongoing.value)
            if (sortBy.value === "asc" || sortBy.value === "desc") {
                url = `https://janas-api-server.azurewebsites.net/studygroups?ongoing=${ongoing.value}&sortBy=name:${sortBy.value}&limit=${5}&skip=${skip.value}`
                console.log(url)
                if (search.value != "") {
                    url = `https://janas-api-server.azurewebsites.net/studygroups?ongoing=${ongoing.value}&sortBy=name:${sortBy.value}&search=${search.value}&limit=${4}&skip=${skip.value}`
                    console.log(url)
                }
            }
            else if (search.value != "") {
                url = `https://janas-api-server.azurewebsites.net/studygroups?ongoing=${ongoing.value}&search=${search.value}&limit=${4}&skip=${skip.value}`
                console.log(url)
            }
            else url = `https://janas-api-server.azurewebsites.net/studygroups?ongoing=${ongoing.value}&limit=${4}&skip=${skip.value}`
            console.log(url)
        }

        else if (sortBy.value == "asc" || sortBy.value == "desc") {
            if (search.value == "") {
                url = `https://janas-api-server.azurewebsites.net/studygroups?sortBy=name:${sortBy.value}&limit=${4}&skip=${skip.value}`
                console.log(url)
            }
            else url = `https://janas-api-server.azurewebsites.net/studygroups?sortBy=name:${sortBy.value}&search=${search.value}&limit=${4}&skip=${skip.value}`
            console.log(url)
        }

        else if (ongoing.value == "" && sortBy.value == "" && search.value != "") {
            url = `https://janas-api-server.azurewebsites.net/studygroups?search=${search.value}&limit=${4}&skip=${skip.value}`
            console.log(url)

        }
        else {
            url = `https://janas-api-server.azurewebsites.net/studygroups?limit=${4}&skip=${skip.value}`
            console.log(url)
        }
    }



    console.log("test2")

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    let response = await fetch(url, options)

    if (response.status == 200) {
        h1.innerHTML = "StudyGroups"
        let data = []
        data = await response.json()

        console.log(data)
        let array = []
        array = data
        let newArray = array;
        let ownedArray = [];
        for (let i = 0; i < array.length; i++) {
            user_id = JSON.parse(user)
            realUserId = JSON.stringify(user_id._id);

            newArray[i].view_meetingTimes = `<button type = "button" class="meetingbtn" id = "${array[i]._id}"> View Meeting Times </button>`
            if ((newArray[i].is_public == true) || (JSON.stringify(array[i].owner) == realUserId)) {
                newArray[i].participants_info = `<button type = "button" class="infobtn" id = "${array[i]._id}"> View Participants Info </button>`
                newArray[i].owner_info = `<button type = "button" class="ownerbtn" id = "${array[i]._id}"> View Owner's Info </button>`

            }
            let members = array[i].participants
            console.log(members)
            for (let j = 0; j < members.length; j++) {
                console.log(members[j])
                if (realUserId == JSON.stringify(members[j])) {
                    console.log("TESTEST")
                    newArray[i].participants_info = `<button type = "button" class="infobtn" id = "${array[i]._id}"> View Participants Info </button>`
                    newArray[i].owner_info = `<button type = "button" class="ownerbtn" id = "${array[i]._id}"> View Owner's Info </button>`
                }
            }

            if (JSON.stringify(array[i].owner) === realUserId) {
                let count = 0
                newArray[i].edit_option = `<button type = "button" class="editbtn" id = "${array[i]._id}"> Edit </button>`
                newArray[i].delete_option = `<button type = "button" class="deletebtn" id = "${array[i]._id}"> Delete </button>`
                ownedArray[count] = newArray[i]
                count++
            }
        }
        for (let i = 0; i < array.length; i++) {
            let memberArray = array[i].participants
            if (array[i].is_public == true) {
                if (memberArray.length == 0) {
                    newArray[i].join_option = `<button type = "button" class="joinbtn" id = "${array[i]._id}"> Join </button>`
                }
            }
            for (let j = 0; j < memberArray.length; j++) {
                let control
                if (realUserId == JSON.stringify(memberArray[j])) {
                    newArray[i].leave_option = `<button type = "button" class="leavebtn" id = "${array[i]._id}"> Leave </button>`
                    console.log("BIGTEST")
                    control = true
                }
            }
            for (let j = 0; j < memberArray.length; j++) {
                if (newArray[i].leave_option == undefined && array[i].is_public == true) {
                    newArray[i].join_option = `<button type = "button" class="joinbtn" id = "${array[i]._id}"> Join </button>`
                    console.log("LILTEST")
                }
                console.log(newArray[i].leave_option)
            }

        }
        let finalArray = [];
        let finalTimesArray = []
        console.log(ownedArray)


        if (owned.value == "true") {
            for (let i = 0; i < ownedArray.length; i++) {
                finalArray[i] = ownedArray[i]
                finalTimesArray[i] = ownedArray[i]
            }
        }
        else if (owned.value == "false" || owned.value == "") {
            for (let i = 0; i < newArray.length; i++) {
                finalArray[i] = newArray[i]
                finalTimesArray[i] = newArray[i]
            }
        }
        console.log(finalArray)
        console.log(finalTimesArray)
        console.log(ownedArray)

        createTableWithInnerHTML(finalArray);

        function createTableWithInnerHTML(finalArray) {
            let tableHTML = '<table border="1"><tr>';
            Object.keys(finalArray[0]).forEach(key => {
                tableHTML += `<th>${key}</th>`;
            });

            tableHTML += '</tr>';

            finalArray.forEach(item => {
                tableHTML += '<tr>';
                Object.values(item).forEach(value => {

                    tableHTML += `<td>${value}</td>`;

                });
                tableHTML += '</tr>';
            });
            tableHTML += '</table>';
            let space = document.querySelector("#searchPrint")
            space.innerHTML = tableHTML;
        }


        document.getElementById("searchStudyGroup").style.display = 'none'

        let button = document.getElementsByClassName("editbtn")
        let button2 = document.getElementsByClassName("meetingbtn")
        let button3 = document.getElementsByClassName("deletebtn")
        let button4 = document.getElementsByClassName("leavebtn")
        let button5 = document.getElementsByClassName("joinbtn")
        let button6 = document.getElementsByClassName("infobtn")
        let button7 = document.getElementsByClassName("ownerbtn")


        finalArray.map.call(button2, (b) => {
            b.addEventListener("click", async function (ev) {
                const sgId2 = ev.currentTarget.id
                console.log(sgId2)

                for (let i = 0; i < finalArray.length; i++) {
                    let vali = []
                    vali[i] = finalArray[i].meeting_times
                    console.log(vali[i])
                    for (let j = 0; j <= finalArray.length; j++) {
                        let valo = []
                        valo = vali[i]
                        valo[j] = JSON.stringify(valo[j])
                        vali[i] = valo
                        finalArray[i].meeting_times = vali[i]
                    }
                    finalArray[i].meeting_times = vali[i]
                    console.log(sgId2)
                    console.log(finalArray[i]._id)
                    if (finalArray[i]._id == sgId2) {
                        document.write(finalArray[i].meeting_times)
                    }
                }
            })
        })

        finalArray.map.call(button3, (b) => {
            b.addEventListener("click", async function (ev) {
                const sgId3 = ev.currentTarget.id
                let dId
                let counter
                for (let i = 0; i < finalArray.length; i++) {
                    if (sgId3 == finalArray[i]._id) {
                        dId = finalArray[i]._id
                        counter = i
                    }
                }
                console.log(sgId3)
                console.log(dId)
                const deleteUrl = `https://janas-api-server.azurewebsites.net/studygroup/${dId}`;

                const options = {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }

                let response = await fetch(deleteUrl, options)

                console.log(response)
                console.log(response.status)

                console.log('delete fetch returned')

                if (response.status === 200) {
                    finalArray.splice(counter, 1)
                    console.log("deleted successfully")
                    location.reload()
                }
                else if (response.status === 401) {
                    console.log('failed to delete')
                }



            })
        })

        finalArray.map.call(button4, (b) => {
            b.addEventListener("click", async function (ev) {
                const sgId3 = ev.currentTarget.id
                const leaveUrl = `https://janas-api-server.azurewebsites.net/studygroup/${sgId3}/participants?add_or_remove=remove`;
                console.log(leaveUrl)
                try {
                    let response = await fetch(leaveUrl, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(user._id)
                    })

                    if (response.status === 200) {
                        location.reload()
                    } else {
                        const errorData = await response.json();
                    }
                } catch (error) {

                }
            })
        })


        finalArray.map.call(button5, (b) => {
            b.addEventListener("click", async function (ev) {
                const sgId3 = ev.currentTarget.id
                const joinUrl = `https://janas-api-server.azurewebsites.net/studygroup/${sgId3}/participants?add_or_remove=add`;
                try {
                    let response = await fetch(joinUrl, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(user._id)
                    })

                    if (response.status === 200) {
                        location.reload()
                    } else {
                        const errorData = await response.json();
                    }
                } catch (error) {

                }
            })
        })




        finalArray.map.call(button6, (b) => {
            b.addEventListener("click", async function (ev) {
                const sgId3 = ev.currentTarget.id
                const Url = `https://janas-api-server.azurewebsites.net/user/${sgId3}`;
                let oID
                for (let i = 0; i < array.length; i++) {
                    if (array[i]._id == sgId3) {
                        oID = array[i].owner
                    }
                }
                try {
                    let response = await fetch(Url, {
                        method: 'GET',
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    })

                    if (response.status === 200) {
                        let data = []
                        data = await response.json()
                        for (let i = 0; i < data.length; i++) {
                            data[i].notifications_msg = `<button type = "button" class="notificationbtn" id = "${data[i]._id}"> Notify </button>`
                        }
                        createTableWithInnerHTML(data)

                        let button8 = document.getElementsByClassName("notificationbtn")

                        data.map.call(button8, (b) => {
                            b.addEventListener("click", async function (ev) {

                                let receiver = ev.currentTarget.id
                                console.log(receiver)

                                let sender = user_id._id
                                const url = "https://janas-api-server.azurewebsites.net/notification"

                                const notificationModal = document.getElementById('sendNotificationModal2')
                                notificationModal.style.display = 'block';


                                document.querySelector('#sendNotificationbtn2').addEventListener("click", async function (ev) {

                                    let subject = document.getElementById("subject2").value
                                    console.log(subject)
                                    let body = document.getElementById("body2").value
                                    let notification_type = document.getElementById("notification_type2").value


                                    let notificationData = {
                                        sender: sender,
                                        receiver: receiver,
                                        subject: subject,
                                        body: body,
                                        is_read: false,
                                        notification_type: notification_type
                                    }
                                    console.log(notificationData)
                                    try {
                                        const response = await fetch(url, {
                                            method: "POST",
                                            headers: {
                                                "Authorization": `Bearer ${token}`,
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify(notificationData)
                                        });
                                        console.log("test4")
                                        if (response.ok) {
                                            console.log('test5')
                                            location.reload()
                                            try {
                                                const data = await response.json();
                                                console.log(data)
                                                mssg.innerHTML = data.message;
                                                message.textContent = 'Thank you! Your study Group has been created!'
                                                message.style.color = 'green';
                                                location.reload()
                                            }
                                            catch (error) {
                                                //  console.error('Error parsing JSON response:', error.message);
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

                                    }

                                })


                            })
                        })

                    } else {
                        const errorData = await response.json();
                    }
                } catch (error) {

                }
            })
        })

        finalArray.map.call(button7, (b) => {
            b.addEventListener("click", async function (ev) {
                const sgId3 = ev.currentTarget.id
                let oID
                for (let i = 0; i < array.length; i++) {
                    if (array[i]._id == sgId3) {
                        oID = array[i].owner
                    }
                }
                console.log("oID: " + oID)
                const Url = `https://janas-api-server.azurewebsites.net/user/owner/${oID}`;

                try {
                    let response = await fetch(Url, {
                        method: 'GET',
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    })

                    if (response.status === 200) {
                        let data = []
                        data[0] = await response.json()
                        for (let i = 0; i < data.length; i++) {
                            data[i].notifications_msg = `<button type = "button" class="notificationbtn" id = "${array[i]._id}"> Notify </button>`
                        }
                        createTableWithInnerHTML(data)
                        let button8 = document.getElementsByClassName("notificationbtn")

                        data.map.call(button8, (b) => {
                            b.addEventListener("click", async function (ev) {
                                let receiver = data[0]._id
                                let sender = user_id._id
                                const url = "https://janas-api-server.azurewebsites.net/notification"

                                const notificationModal = document.getElementById('sendNotificationModal')
                                notificationModal.style.display = 'block';


                                document.querySelector('#sendNotificationbtn').addEventListener("click", async function (ev) {

                                    let subject = document.getElementById("subject").value
                                    console.log(subject)
                                    let body = document.getElementById("body").value
                                    let notification_type = document.getElementById("notification_type").value


                                    let notificationData = {
                                        sender: sender,
                                        receiver: receiver,
                                        subject: subject,
                                        body: body,
                                        is_read: false,
                                        notification_type: notification_type
                                    }
                                    console.log(notificationData)
                                    try {
                                        const response = await fetch(url, {
                                            method: "POST",
                                            headers: {
                                                "Authorization": `Bearer ${token}`,
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify(notificationData)
                                        });
                                        console.log("test4")
                                        if (response.ok) {
                                            console.log('test5')
                                            location.reload()
                                            try {
                                                const data = await response.json();
                                                console.log(data)
                                                mssg.innerHTML = data.message;
                                                message.textContent = 'Thank you! Your study Group has been created!'
                                                message.style.color = 'green';
                                                location.reload()
                                            } catch (error) {
                                                //  console.error('Error parsing JSON response:', error.message);
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

                                    }
                                })


                            })
                        })


                    } else {
                        const errorData = await response.json();
                    }
                } catch (error) {

                }
            })
        })



        finalArray.map.call(button, (b) => {
            b.addEventListener("click", async function (ev) {
                console.log("clicked")

                const editModal = document.getElementById('editStudyGroupModule')
                editModal.style.display = 'block';

                const sgId = ev.currentTarget.id

                let currentGroup;
                let currentTimesGroup;
                for (let i = 0; i < array.length; i++) {
                    if (sgId == array[i]._id) {
                        currentGroup = array[i]
                    }
                }

                for (let i = 0; i < finalTimesArray.length; i++) {
                    if (sgId == finalTimesArray[i]._id) {
                        currentTimesGroup = finalTimesArray[i]
                    }
                }

                let timesArray = []
                timesArray = currentTimesGroup.meeting_times
                console.log(currentTimesGroup)
                console.log(timesArray)
                for (let j = 0; j <= timesArray.length; j) {
                    console.log(timesArray[j])
                    if (timesArray[j] != undefined) {
                        document.getElementById("day1").value = timesArray[j].day;
                        document.getElementById("time1").value = timesArray[j].time;
                        document.getElementById("location1").value = timesArray[j].location;
                    }

                    j++
                    console.log(timesArray[j])
                    if (timesArray[j] != undefined) {
                        document.getElementById("day2").value = timesArray[j].day;
                        document.getElementById("time2").value = timesArray[j].time;
                        document.getElementById("location2").value = timesArray[j].location;
                    }

                    j++
                    console.log(timesArray[j])
                    if (timesArray[j] != undefined) {
                        document.getElementById("day3").value = timesArray[j].day;
                        document.getElementById("time3").value = timesArray[j].time;
                        document.getElementById("location3").value = timesArray[j].location;
                    }
                    j++
                    console.log(timesArray[j])
                    if (timesArray[j] != undefined) {
                        document.getElementById("day4").value = timesArray[j].day;
                        document.getElementById("time4").value = timesArray[j].time;
                        document.getElementById("location4").value = timesArray[j].location;
                    }
                    j++
                    console.log(timesArray[j])
                    if (timesArray[j] != undefined) {
                        document.getElementById("day5").value = timesArray[j].day;
                        document.getElementById("time5").value = timesArray[j].time;
                        document.getElementById("location5").value = timesArray[j].location;
                    }
                    j++
                    console.log(timesArray[j])
                    if (timesArray[j] != undefined) {
                        document.getElementById("day6").value = timesArray[j].day;
                        document.getElementById("time6").value = timesArray[j].time;
                        document.getElementById("location6").value = timesArray[j].location;
                    }
                    j++
                    console.log(timesArray[j])
                    if (timesArray[j] != undefined) {
                        document.getElementById("day7").value = timesArray[j].day;
                        document.getElementById("time7").value = timesArray[j].time;
                        document.getElementById("location7").value = timesArray[j].location;
                    }
                }

                document.getElementById("name0").placeholder = currentGroup.name;
                console.log(document.getElementById("name0"))
                console.log("NAME: " + currentGroup.name)
                document.getElementById("is_public0").placeholder = currentGroup.is_public;
                document.getElementById("max_participants0").placeholder = currentGroup.max_participants;
                document.getElementById("start_date0").placeholder = currentGroup.start_date;
                document.getElementById("end_date0").placeholder = currentGroup.end_date;
                document.getElementById("description0").placeholder = currentGroup.description;
                document.getElementById("school0").placeholder = currentGroup.school;
                document.getElementById("course_number0").placeholder = currentGroup.course_number;


                let times = [];
                console.log("oni: " + times);
                const editMeetingTimesBtn = document.querySelector("#sendMeetingTimes0")
                console.log(editMeetingTimesBtn)
                document.querySelector("#sendMeetingTimes0").addEventListener('click', async function (event) {
                    console.log("jana")
                    let day = document.getElementById('day1').value;
                    let time = document.getElementById('time1').value;
                    let location = document.getElementById('location1').value;
                    if (day != "") {
                        times.push({ day, time, location });
                    }

                    day = document.getElementById('day2').value;
                    time = document.getElementById('time2').value;
                    location = document.getElementById('location2').value;
                    if (day != "") {
                        times.push({ day, time, location });
                    }

                    day = document.getElementById('day3').value;
                    time = document.getElementById('time3').value;
                    location = document.getElementById('location3').value;
                    if (day != "") {
                        times.push({ day, time, location });
                    }

                    day = document.getElementById('day4').value;
                    time = document.getElementById('time4').value;
                    location = document.getElementById('location4').value;
                    if (day != "") {
                        times.push({ day, time, location });
                    }

                    day = document.getElementById('day5').value;
                    time = document.getElementById('time5').value;
                    location = document.getElementById('location5').value;
                    if (day != "") {
                        times.push({ day, time, location });
                    }
                    day = document.getElementById('day6').value;
                    time = document.getElementById('time6').value;
                    location = document.getElementById('location6').value;
                    if (day != "") {
                        times.push({ day, time, location });
                    }
                    day = document.getElementById('day7').value;
                    time = document.getElementById('time7').value;
                    location = document.getElementById('location7').value;
                    if (day != "") {
                        times.push({ day, time, location });
                    }
                    document.getElementById('meetingTimesModal0').style.display = 'none';

                });



                const editBt = document.getElementById('editStudyGroupButton')
                ///get the data from the modal here
                console.log(editBt)
                editBt.addEventListener('click', async () => {

                    console.log("POOKIE: " + array)

                    let name = document.getElementById('name0').value;
                    let is_public = document.getElementById('is_public0').value;
                    let max_participants = document.getElementById('max_participants0').value;
                    let start_date = document.getElementById('start_date0').value;
                    let end_date = document.getElementById('end_date0').value;
                    let description = document.getElementById('description0').value;
                    let school = document.getElementById('school0').value;
                    let course_number = document.getElementById('course_number0').value;

                    console.log(day)

                    let currentGroup;
                    for (let i = 0; i < array.length; i++) {
                        if (sgId == array[i]._id) {
                            currentGroup = array[i]
                            console.log(currentGroup)
                        }
                    }

                    document.getElementById("name0").placeholder = name;
                    console.log(document.getElementById("name0"))
                    console.log("NAME: " + name)


                    if (name == "") {
                        name = currentGroup.name;
                    }

                    if (is_public == "") {
                        is_public = currentGroup.is_public;
                    }

                    if (max_participants == "") {
                        max_participants = currentGroup.max_participants;
                    }
                    if (start_date == "") {
                        start_date = currentGroup.start_date;
                    }
                    if (end_date == "") {
                        end_date = currentGroup.end_date;
                    }
                    if (description == "") {
                        description = currentGroup.description;
                    }
                    if (school == "") {
                        school = currentGroup.school;
                    }
                    if (course_number == "") {
                        course_number = currentGroup.course_number;
                    }
                    if (start_date == false) {
                        start_date = undefined;
                    }
                    if (end_date == false) {
                        end_date = undefined;
                    }

                    let dita = document.getElementById("day1").value

                    const editstudyGroupData = {
                        name: name,
                        is_public: is_public,
                        max_participants: max_participants,
                        start_date: start_date,
                        end_date: end_date,
                        meeting_times: times,
                        description: description,
                        school: school,
                        course_number: course_number,

                    };
                    console.log("DAY" + dita)
                    let editStudyGroup;
                    console.log(dita.value)
                    if (dita.value == "") {
                        const editstudyGroupData2 = {
                            name: name,
                            is_public: is_public,
                            max_participants: max_participants,
                            start_date: start_date,
                            end_date: end_date,
                            description: description,
                            school: school,
                            course_number: course_number,
                        };
                        editStudyGroup = editstudyGroupData2;
                    }

                    else {
                        editStudyGroup = editstudyGroupData;
                    }


                    const mssg = document.querySelector("p");
                    const url = `https://janas-api-server.azurewebsites.net/studygroup/${sgId}`;
                    const token = localStorage.getItem("token");
                    console.log('test3')
                    body: JSON.stringify(editStudyGroup)
                    console.log("Shiko: " + JSON.stringify(editStudyGroup))
                    try {
                        const response = await fetch(url, {
                            method: "PATCH",
                            headers: {
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(editStudyGroup)
                        });
                        console.log("test4")
                        if (response.ok) {
                            console.log('test5')
                            try {
                                const data = await response.json();
                                console.log(data)
                                document.getElementById("editStudyGroupModule").style.display = 'none'
                                location.reload()

                            } catch (error) {
                                mssg.style.color = 'green';
                                location.href = "main.html";
                            }
                        } else {
                            const errorData = await response.json();
                            mssg.innerHTML = "Error: " + errorData.message;
                            mssg.style.color = 'red';
                        }
                    } catch (error) {
                        mssg.innerHTML = "Error: " + error.message;
                        mssg.style.color = 'red';
                    }

                });


            });
        })
    }

    else {
        h1.innerHTML = "Something went wrong."
        p.innerHTML = "Please try again!"

        console.log("Error ")
    }
})
