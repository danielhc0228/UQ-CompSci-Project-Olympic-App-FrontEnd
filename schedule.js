const ipAddress = "https://deco3801-developersx4.uqcloud.net/api";
// const ipAddress = 'http://127.0.0.1';
const storedEmail = localStorage.getItem("userEmail");
let userId;

async function initialize() {
    if (storedEmail) {
        const user = await getUserByEmail(storedEmail);
        userId = user ? user.user_id : 2;
    }
    fetchAndDisplayEvents();
}

function fetchAndDisplayEvents() {
    // get the plan for user id = userId
    fetch(`${ipAddress}/users/` + userId + "/bookmarkedEvents")
        .then((response) => response.json())
        .then((data) => {
            const container = document.getElementById("cardContainer");

            // hendel the case that the schedule table is empty
            if (data.length === 0) {
                const div = document.createElement("div");
                div.style.height = "50px";

                const anchor = document.createElement("a");
                anchor.href = "allEvents.html";
                anchor.style.color = "black";
                anchor.style.textDecoration = "none";

                const card = document.createElement("div");
                card.className = "card";
                card.id = "card";
                card.textContent =
                    "Your schedule table is currently empty, click me to add events";
                card.style.margin = "0";
                card.style.cursor = "pointer";

                container.appendChild(div);
                container.appendChild(anchor);
                anchor.appendChild(card);
            }

            // navigates to all event page
            const toAllEvents = document.createElement("button");
            toAllEvents.className = "edit";
            toAllEvents.id = "toAllEvents";
            toAllEvents.textContent = "Event list";
            toAllEvents.style.transform = 'translateX(-60px)';
            container.appendChild(toAllEvents);

            // add a config button
            const edit = document.createElement("button");
            edit.className = "edit";
            edit.id = "schedule-editor";
            edit.textContent = "Edit";
            container.appendChild(edit);

            data.forEach((event) => {
                const localDate = new Date(event.date)
                    .toLocaleDateString()
                    .split(" ")[0];
                console.log(localDate);

                // grouping cards by date
                if (!document.getElementById(formatDate(event.date))) {
                    const separator = document.createElement("h2");
                    separator.textContent = `${formatDate(event.date)}`;
                    separator.id = formatDate(event.date);
                    separator.className = "separator";
                    container.appendChild(separator);

                    const now = new Date();
                    const eventDate = new Date(event.date);

                    if (
                        now.getDate() === eventDate.getUTCDate() &&
                        now.getMonth() === eventDate.getUTCMonth()
                    ) {
                        separator.className = "separator today";
                    }
                }

                // create card elements
                const card = document.createElement("div");
                card.className = "card";

                const contentDiv = document.createElement("div");
                contentDiv.className = "card-content";

                const toDetail = document.createElement("a");
                toDetail.style.color = 'black';
                toDetail.style.textDecoration = 'none';
                toDetail.href = 'events.html?eventId=' + encodeURIComponent(event.event_id);
                contentDiv.appendChild(toDetail);

                const sportElement = document.createElement("h2");
                sportElement.textContent = event.event_name;
                toDetail.appendChild(sportElement);

                const locationElement = document.createElement("p");
                locationElement.textContent = `Venue: ${event.venue}`;
                contentDiv.appendChild(locationElement);

                const dateElement = document.createElement("p");
                dateElement.textContent = `Date: ${formatDate(event.date)}`;
                contentDiv.appendChild(dateElement);

                const timeElement = document.createElement("p");
                timeElement.textContent = `Time: ${event.start_time} ~ ${event.end_time}`;
                contentDiv.appendChild(timeElement);

                card.appendChild(contentDiv);

                // create checkbox for each event card
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = `${userId}-${event.event_id}`;
                checkbox.className = "checkbox";
                checkbox.name = "selectedEvents";
                card.appendChild(checkbox);

                container.appendChild(card);
            });

            // EVENTLISTENER
            // required const
            const allCheckboxs = document.querySelectorAll(".checkbox");
            const selectAll = document.getElementById("selectAll");

            toAllEvents.addEventListener("click", () => {
                window.location.href = "allEvents.html";
            })

            // hide and show the checkbox on cards, and the select bar at the bottom, unselect every checkbox
            edit.addEventListener("click", () => {
                edit.classList.toggle("editing");

                allCheckboxs.forEach((checkbox) => {
                    checkbox.classList.toggle("displayBlock");
                    checkbox.checked = false;
                    selectAll.textContent = "Select all";
                });

                const selectBar = document.getElementById("select-bar");
                selectBar.classList.toggle("displayFlex");
            });

            // select or unselect all checkbox
            selectAll.addEventListener("click", () => {
                const unselectedEvents = document.querySelectorAll(
                    'input[name="selectedEvents"]:not(:checked)'
                );
                if (unselectedEvents.length > 0) {
                    unselectedEvents.forEach((unchecked) => {
                        unchecked.checked = true;
                        selectAll.textContent = "Unselect all";
                    });
                } else {
                    allCheckboxs.forEach((checkbox) => {
                        checkbox.checked = false;
                        selectAll.textContent = "Select all";
                    });
                }
            });

            // check the state of all checkbox, if all checkbox are selected, change the text to "Unselect all",
            // else, change the text to "select all"
            allCheckboxs.forEach((checkbox) => {
                checkbox.addEventListener("change", () => {
                    const unselectedEvents = document.querySelectorAll(
                        'input[name="selectedEvents"]:not(:checked)'
                    );
                    if (unselectedEvents.length > 0) {
                        selectAll.textContent = "Select all";
                    } else {
                        selectAll.textContent = "Unselect all";
                    }
                });
            });

            // remove all selected events from user_events
            const removeButton = document.getElementById("remove");
            const promises = [];
            removeButton.addEventListener("click", () => {
                const selectedEvents = document.querySelectorAll(
                    'input[name="selectedEvents"]:checked'
                );
                selectedEvents.forEach((checkedEvent) => {
                    const userId = checkedEvent.id.split("-")[0];
                    const eventId = checkedEvent.id.split("-")[1];
                    promises.push(removeFromDatabase(userId, eventId));
                });
                Promise.all(promises).then(() => {
                    location.reload(true);
                });
            });
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

// FUNCTIONS
// formatting the date representation
function formatDate(isoString) {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const date = new Date(isoString);

    return `${date.getUTCDate()} ${months[date.getUTCMonth()]}`;
}

// unbookmark an event from schedule
function removeFromDatabase(userId, eventId) {
    return fetch(`${ipAddress}/users/unbookmark`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: userId,
            event_id: eventId,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                console.log("Network response was not ok");
            }
            return response.text();
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.error(error);
        });
}

// get user by email
async function getUserByEmail(email) {
    return fetch(`${ipAddress}/users/getUserByEmail?email=${email}`, {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) {
                console.log(response.status, response.statusText);
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            if (data.message) {
                console.log(data.message);
            }
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

initialize();
