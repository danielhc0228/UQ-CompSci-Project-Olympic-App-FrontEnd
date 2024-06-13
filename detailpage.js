const ipAddress = "https://deco3801-developersx4.uqcloud.net/api";

const description = document.getElementById("description");
const currentUrl = window.location.href;
const eventId = currentUrl.split('=')[1];

// fetching event description from database
// Define the function as asynchronous
async function fetchDescriptions() {
    try {
        // Use async/await with fetch
        const response = await fetch(`${ipAddress}/events/`);
        const data = await response.json();

        // Get the corresponding event
        const specificEvent = data.find(
            (event) =>
                event.event_id ===
                parseInt(decodeURIComponent(getURLParameter()), 10)
        );
               // add heading
               const heading = document.createElement("h3");
               heading.textContent = `${specificEvent.category} - ${specificEvent.event_name}`;
               heading.id = "detailheading";
               description.appendChild(heading);
       
               // create info section of that event
               const info = document.createElement("div");
               description.appendChild(info);
       
               // generate relevant info about that event
               const date = document.createElement("h4");
               date.textContent = `Date: ${formatDate(specificEvent.date)}`;
               date.id = "detaildate";
               info.appendChild(date);
       
               const start = document.createElement("h4");
               start.textContent = `Start Time: ${specificEvent.start_time}`;
               start.id = "detailstart";
               info.appendChild(start);
       
               const end = document.createElement("h4");
               end.textContent = `End Time: ${specificEvent.end_time}`;
               end.id = "detailend";
               info.appendChild(end);
       
               const venue = document.createElement("h4");
               venue.textContent = `Venue: ${specificEvent.venue}`;
               venue.id = "detailvenue";
               info.appendChild(venue);
       
               const content = document.createElement("p");
               content.id = "detailp";
               content.textContent = specificEvent.description;
               description.appendChild(content);

               const nav = document.createElement('a');
               nav.textContent = "Go to event list";
               nav.href =  "allEvents.html#" + specificEvent.category;
               description.appendChild(nav);

           } catch (error) {
               console.error(error);
           }
}

// Read url and get the text after eventId=
function getURLParameter() {
    const currentUrl = window.location.href;
    const parts = currentUrl.split("eventId=");
    if (parts.length < 2) {
        return null;
    }
    return parts[1].split("&")[0];
}

// change time format. e.g. 2024-08-21 -> 21 August
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

// Function to get the language from the cookie
function getLanguageFromCookie() {
    return getCookie("selectedLanguage") || "en";
}

// Function to get a cookie
function getCookie(name) {
    const cookieName = name + "=";
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === " ") {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}
//Translation part
// cd C:\Users\jaech\Documents\deco3801\frontend
// browserify features.js -o bundle.js
window.addEventListener("load", async () => {
    await fetchDescriptions();

    const selectedLang = getLanguageFromCookie();
    document.getElementById("languageSelector").value = selectedLang;
    const targetLanguage = document.getElementById("languageSelector").value;
    console.log(targetLanguage)

    const detailheading = document.getElementById("detailheading").textContent;
    const detaildate = document.getElementById("detaildate").textContent;
    const detailstart = document.getElementById("detailstart").textContent;
    const detailend = document.getElementById("detailend").textContent;
    const detailvenue = document.getElementById("detailvenue").textContent;
    const detailp = document.getElementById("detailp").textContent;
    // Translation feature
    const { Translate } = require("./@google-cloud/translate").v2;
    const translate = new Translate({
        key: "AIzaSyBdttKy_B1sVYJ9lk0QbhubZktwo0xUSvk",
    });

    async function translateText(text, targetLanguage) {
        let result = await translate.translate(text, targetLanguage);
        return result[0];
    }

    document.getElementById("detailheading").textContent = await translateText(
        detailheading,
        targetLanguage
    );
    document.getElementById("detaildate").textContent = await translateText(
        detaildate,
        targetLanguage
    );
    document.getElementById("detailstart").textContent = await translateText(
        detailstart,
        targetLanguage
    );
    document.getElementById("detailend").textContent = await translateText(
        detailend,
        targetLanguage
    );
    document.getElementById("detailvenue").textContent = await translateText(
        detailvenue,
        targetLanguage
    );
    document.getElementById("detailp").textContent = await translateText(
        detailp,
        targetLanguage
    );
});