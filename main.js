const api = {
    key: "fc4670399e75ddcd0b3ecc9038b4503c",
    base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-input');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
    if (evt.keyCode == 13) {
        // getResults(searchbox.value);
        console.log(searchbox.value);
    }
}

