const ipAddress = 'https://deco3801-developersx4.uqcloud.net/api';
// const ipAddress = 'http://127.0.0.1';
const storedEmail = localStorage.getItem('userEmail');
let userId;

// Check login status, if not logged in, use defult account
async function initialize() {
    if (storedEmail) {
        const user = await getUserByEmail(storedEmail);
        userId = user ? user.user_id : 2;
    }
    fetchAndDisplayEvents();
}

function fetchAndDisplayEvents() {
    fetch(`${ipAddress}/events/`)
    .then(response => response.json())
    .then(data => {
        // randomly choose 5 events from database
        const recommended = [];
        while (recommended.length < 5) {
            const selectedEvent = getRandomElement(data);
            if (!recommended.includes(selectedEvent)) {
                recommended.push(selectedEvent);
            }
        }

        // select recommended event container
        const recommendedList = document.getElementById('recommended-list');
        recommended.forEach(event => {

            // create event card
            const eventCard = document.createElement('li');
            eventCard.className = 'event-card';
            recommendedList.appendChild(eventCard);

            // anchor navigates to detail page
            const anchor = document.createElement('a');
            anchor.href = 'events.html?eventId=' + encodeURIComponent(event.event_id);
            eventCard.appendChild(anchor);

            // event card image content
            const image = document.createElement('img');
            image.className = 'event-card-background';
            image.src = getImagePath(event.category);
            anchor.appendChild(image);

            // event title container
            const titleContainer = document.createElement('div');
            titleContainer.className = 'event-card-text event-title';
            anchor.appendChild(titleContainer);

            // event title
            const eventTitle = document.createElement('h3');
            eventTitle.textContent = `${event.event_name}`;
            titleContainer.appendChild(eventTitle);

            // event info container
            const infoContainer = document.createElement('div');
            infoContainer.className = 'event-card-text event-info';
            anchor.appendChild(infoContainer);

            // event info
            const date = document.createElement('p');
            const venue = document.createElement('p');
            date.textContent = `${formatDate(event.date)}`;
            venue.textContent = `${event.venue}`;
            infoContainer.appendChild(date);
            infoContainer.appendChild(venue);
            
        })
    })

    // fetch events between given date
    const today = new Date();
    const start = '2024-08-02'
    const end = '2024-08-03'
    // fetch(`${ipAddress}/events/getEventsBetweenDates?startDate=${formatDateToYMD(today)}&endDate=${nextDay(today)}`, {
    fetch(`${ipAddress}/events/getEventsBetweenDates?startDate=${start}&endDate=${end}`, {

        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            console.log('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // select upcoming event container
        const upcomingList = document.getElementById('upcoming-list');
        if (data.length === 0) {
            const eventCard = document.createElement('li');
            eventCard.className = 'event-card';
            eventCard.style.whiteSpace = "normal";
            eventCard.style.backgroundColor = 'lightgray';
            eventCard.textContent = 'Events start on 2024-07-24, end on 2024-08-06 (change your system time to between those date, you can see listed events)'
            upcomingList.appendChild(eventCard);
        } else {
            data.forEach(event => {
    
                // create event card
                const eventCard = document.createElement('li');
                eventCard.className = 'event-card';
                upcomingList.appendChild(eventCard);
    
                // anchor navigates to detail page
                const anchor = document.createElement('a');
                anchor.href = 'events.html?eventId=' + encodeURIComponent(event.event_id);
                eventCard.appendChild(anchor);
    
                // event card image content
                const image = document.createElement('img');
                image.className = 'event-card-background';
                image.src = getImagePath(event.category);
                anchor.appendChild(image);
    
                // event title container
                const titleContainer = document.createElement('div');
                titleContainer.className = 'event-card-text event-title';
                anchor.appendChild(titleContainer);
    
                // event title
                const eventTitle = document.createElement('h3');
                eventTitle.textContent = `${event.event_name}`;
                titleContainer.appendChild(eventTitle);
    
                // event info container
                const infoContainer = document.createElement('div');
                infoContainer.className = 'event-card-text event-info';
                anchor.appendChild(infoContainer);
    
                // event info
                const date = document.createElement('p');
                const venue = document.createElement('p');
                date.textContent = `${formatDate(event.date)}`;
                venue.textContent = `${event.venue}`;
                infoContainer.appendChild(date);
                infoContainer.appendChild(venue);
            })
        }
    })
    .catch(error => {
        console.log(error);
    });
    
}

// select random element from an array
function getRandomElement(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}
  
// change time format. e.g. 2024-08-21 -> 21 August 
function formatDate(isoString) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const date = new Date(isoString);
    
    return `${date.getUTCDate()} ${months[date.getUTCMonth()]}`;
}

// get user by email
async function getUserByEmail(email) {
    return fetch(`${ipAddress}/users/getUserByEmail?email=${email}`, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            console.log('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.message) {
            console.log(data.message);
        }
        return data;
    }).catch(error => {
        console.error(error);
    })
}

// get event image 
function getImagePath(eventCategory) {
    const path = '/images/events/';
    const category = eventCategory;
    const index = Math.floor(Math.random() * 3);
    return path + category + index + '.jpg';
}

// input new Date type, return next day in YYYY-MM-DD format
function nextDay(todayDate) {
    const today = new Date(todayDate);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return formatDateToYMD(tomorrow);
}

// input new Date type, return in YYYY-MM-DD format
function formatDateToYMD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

initialize();



