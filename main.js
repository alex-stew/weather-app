const cityTitleEl = document.querySelector(".current-city");
const currentDateEl = document.querySelector(".current-date");
const currentIconEl = document.querySelector(".current-icon");
const currentTempEl = document.querySelector(".current-temp");
const currentHumidEl = document.querySelector(".current-humid");
const currentWindEl = document.querySelector(".current-wind");
const currentUvEl = document.querySelector(".current-UV");
const currentWeatherEl = document.querySelector(".current-weather");

const weatherContainer = document.querySelector(".weather-container");

const cityInputEl = document.querySelector(".search-input");

const buttonContainer = document.querySelector(".sidebar-history");

const api = {
    key: "fc4670399e75ddcd0b3ecc9038b4503c",
    base: "https://api.openweathermap.org/data/2.5/"
}

var cityArray = [];

//This will put our array into local storage
function storeSearches() {
    localStorage.setItem("cities", JSON.stringify(cityArray));
}

//Adds searched cities to then be added as a list of buttons on the page
function createList() {
    $(".cityArray").empty();
    cityArray.forEach(function(city) {
        $(buttonContainer).prepend($(`<button class = "prevSearchButton" data-city="${city}">${city}</button>`));
    })
}

//On site load, the last stored city is called through the API for current and forecast functions
function load(){
    var storedSearches = JSON.parse(localStorage.getItem("cities"));

    if (storedSearches !==null) {
        cityArray = storedSearches;
    }

    createList();

    if (cityArray) {
        var currentCity = cityArray[cityArray.length -1]
        getTodayResults(currentCity, api.key);
        // getForecastResults(currentCity, api.key);
    }
}

cityInputEl.addEventListener('keypress', setQuery);

function setQuery(evt) {
    if (evt.keyCode == 13) {
        console.log(cityInputEl.value);
        var newEntry = $(cityInputEl).val().trim();
        cityArray.push(newEntry);
        createList();
        storeSearches();
        getTodayResults(cityInputEl.value);
        getForecastResults(cityInputEl.value);
    }
}

function getTodayResults (query) {
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weatherCurrent => {
        return weatherCurrent.json();
    }).then(displayTodayResults);
}

function displayTodayResults (weatherCurrent) {
    console.log(weatherCurrent);
    $(cityTitleEl).append(weatherCurrent.name)&&(weatherCurrent.sys.country); 
    $(currentDateEl).append(moment(weatherCurrent.dt,'X' ).format('DD MMMM YYYY'));
    $(currentIconEl).attr("src", `https://openweathermap.org/img/wn/${weatherCurrent.weather[0].icon}@2x.png`);
    $(currentTempEl).append(weatherCurrent.main.temp.toFixed(0) + "°c");
    $(currentHumidEl).append(weatherCurrent.main.humidity + " %");
    $(currentWindEl).append(weatherCurrent.wind.speed + " m/s");
    $(currentWeatherEl).append(weatherCurrent.weather[0].main);

    currentCityCoords.lat = weatherCurrent.coord.lat;
    currentCityCoords.lon = weatherCurrent.coord.lon;
}

function getForecastResults (query) {
    fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
    .then(weatherFore => {
        return weatherFore.json();
    }).then(displayForecastResults);
}

function displayForecastResults (weatherFore) {
    console.log(weatherFore);
    // $(currentDateEl).append(moment(weather.dt,'X' ).format('DD'));
    // $(currentIconEl).attr("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    // $(currentTempEl).append(weather.main.temp.toFixed(0) + "°c");
    // $(currentWeatherEl).append(weather.weather[0].main);
}

//Calls the last stored if it exists, to the initial screen
load();
