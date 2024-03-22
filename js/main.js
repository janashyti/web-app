const token = localStorage.getItem("token");
console.log("token: " + token)
const user = localStorage.getItem("user");


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

    function createTableWithInnerHTML(finalArray) {
        console.log(finalArray)
        for (let i = 0; i < finalArray.length; i++) {
            let vali = []
            vali[i] = finalArray[i].meeting_times
            console.log(vali[i])
            for (let j = 0; j <= finalArray.length; j++) {
                let valo = []
                valo = vali[i]
                valo[j] = JSON.stringify(valo[j])
                console.log(valo[j])
                vali[i] = valo
                console.log(vali[i])
                console.log("VAlO j: " + j + valo[j])
                finalArray[i].meeting_times = vali[i]
                console.log(finalArray[i])
            }
            //finalArray[i].meeting_times = vali[i]
        }
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


        //document.writeln(tableHTML);
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
            let user_id = JSON.parse(user)
            // console.log("user_id: " + user_id)
            let realUserId = JSON.stringify(user_id._id);
            // console.log("realUserId: " + realUserId)
            if (JSON.stringify(array[i].owner) === realUserId) {
                //newArray = array.map(v => ({...v, edit_option: document.innerHTML = "<button id = 'editBtn' >" + "Edit" + "</button>"}))
                newArray[i].edit_option = `<button type = "button" class="editbtn" id = "${array[i]._id}"> Edit </button>`
                ownedArray[i] = array[i]
            }

        }
        let finalArray = [];

        if (owned.value == "true") {
            for (let i = 0; i < ownedArray.length; i++) {
                finalArray[i] = ownedArray[i]
            }
        }
        else if (owned.value == "false" || owned.value == "") {
            for (let i = 0; i < newArray.length; i++) {
                finalArray[i] = newArray[i]
            }
        }
        console.log(finalArray)

        createTableWithInnerHTML(finalArray);


        document.getElementById("searchStudyGroup").style.display = 'none'

        let button = document.getElementsByClassName("editbtn")
        console.log(document.getElementsByClassName("editbtn"))
        console.log("button: " + JSON.stringify(finalArray.edit_option))

        finalArray.map.call(button, (b) => {
            b.addEventListener("click", async function (ev) {
                console.log("clicked")

                const editModal = document.getElementById('editStudyGroupModule')
                console.log(editModal)
                editModal.style.display = 'block';



                const sgId = ev.currentTarget.id

                let currentGroup;
                for (let i = 0; i < array.length; i++) {
                    if (sgId == array[i]._id) {
                        currentGroup = array[i]
                        console.log(currentGroup)
                    }
                }

                document.getElementById("name0").placeholder = currentGroup.name;
                console.log(document.getElementById("name0"))
                console.log("NAME: " + currentGroup.name)
                document.getElementById("is_public0").placeholder = currentGroup.is_public;
                document.getElementById("max_participants0").placeholder = currentGroup.max_participants;
                document.getElementById("start_date0").placeholder = currentGroup.start_date;
                document.getElementById("end_date0").placeholder = currentGroup.end_date;
                document.getElementById("day0").placeholder = currentGroup.day;
                document.getElementById("time0").placeholder = currentGroup.time;
                document.getElementById("location0").placeholder = currentGroup.location;
                document.getElementById("description0").placeholder = currentGroup.description;
                document.getElementById("school0").placeholder = currentGroup.school;
                document.getElementById("course_number0").placeholder = currentGroup.course_number;


                let times = [];
                console.log("oni: " + times);
                const editMeetingTimesBtn = document.querySelector("#sendMeetingTimes0")
                console.log(editMeetingTimesBtn)
                document.querySelector("#sendMeetingTimes0").addEventListener('click', async function (event) {
                    console.log("jana")
                    let day = document.getElementById('day0').value;
                    let time = document.getElementById('time0').value;
                    let location = document.getElementById('location0').value;
                    times.push({ day, time, location });
                    console.log(times)
                    console.log("TEST")
                    document.querySelector('#day0').value = "";
                    document.querySelector('#time0').value = "";
                    document.querySelector('#location0').value = "";

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

                    let dita = document.getElementById("day0").value

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
