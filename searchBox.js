// Searching functions
const homeSearchBox = document.getElementById("home-search-box");
const mainSearchBox = document.getElementById("main-search-box");
const searchOverlay = document.getElementById("search-overlay");
const suggestionsBox = document.getElementById("suggestions-box");

const suggestions = [
    "Test",
    "Archery",
    "Artistic Gymnastics",
    "Artistic Swimming",
    "Athletics",
    "Badminton",
    "Baseball Softball",
    "Basketball",
    "Beach Volleyball",
    "Boxing",
    "Breaking",
    "Canoe Flatwater",
    "Canoe Slalom",
    "Cycling BMX Freestyle",
    "Cycling BMX Racing",
    "Cycling Mountain Bike",
    "Cycling Road",
    "Cycling Track"
];

// add event listener
homeSearchBox.addEventListener("focus", function () {
    searchOverlay.style.display = "flex";
    mainSearchBox.value = "";
    mainSearchBox.focus();
});

searchOverlay.addEventListener("click", function (e) {
    if (e.target === searchOverlay) {
        searchOverlay.style.display = "none";
        mainSearchBox.value = ""; // Clear the overlay search input
        mainSearchBox.blur(); // Remove focus from the overlay search input
    }
});

mainSearchBox.addEventListener("input", handleInput);

// functions
function handleInput(event) {
    const value = formatting(event.target.value);

    const filteredSuggestions = suggestions.filter((s) => s.startsWith(value));

    suggestionsBox.innerHTML = "";
    if (value != "") {
        displaySuggestions(filteredSuggestions);
    } else {
        suggestionsBox.style.display = "none";
    }
}

// Capitalize the first letter of each word in the sentence
// e.g. artistic gymnastics -> Artistic Gymnastics
function formatting(string) {
    var value = string.toLowerCase().split(" ");

    for (let i = 0; i < value.length; i++) {
        value[i] = value[i].charAt(0).toUpperCase() + value[i].slice(1);
    }

    value = value.join(" ");
    return value;
}

// auto complete user's input, and create a drop down menu
function displaySuggestions(suggestions) {
    suggestions.forEach((suggestion) => {

        const a = document.createElement("a");
        a.href = "allEvents.html#" + suggestion.split(" ").join("");
        a.style.textDecoration = 'none';
        suggestionsBox.appendChild(a);

        const div = document.createElement("div");
        div.className = "suggestion";
        div.textContent = suggestion;
        div.onclick = function () {
                    mainSearchBox.value = suggestion;
                    suggestionsBox.style.display = "none";
                };
        a.appendChild(div);

        const hr = document.createElement("hr");
        hr.className = "suggestion-separator";
        div.appendChild(hr);
        
    });
    suggestionsBox.style.display = suggestions.length ? "block" : "none";
}
