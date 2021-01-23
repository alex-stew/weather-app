const cityTitleEl = document.querySelector(".current-city");
const currentDateEl = document.querySelector(".current-date");
const currentIconEl = document.querySelector(".current-icon");
const currentTempEl = document.querySelector(".current-temp");
const currentHumidEl = document.querySelector(".current-humid");
const currentWindEl = document.querySelector(".current-wind");
const currentUvEl = document.querySelector(".current-UV");
const currentWeatherEl = document.querySelector(".current-weather");

const clearButtonEl = document.querySelector(".clear-container");
let prevSearchButtonEl = document.querySelector(".prevSearchButton")

const weatherContainer = document.querySelector(".weather-container");
const todayForecastEl = document.querySelector(".today-forecast");
const forecastEl = document.querySelector(".forecast-container");
const cityInputEl = document.querySelector(".search-input");

const buttonContainer = document.querySelector(".sidebar-history");

const api = {
    key: "fc4670399e75ddcd0b3ecc9038b4503c",
    base: "https://api.openweathermap.org/data/2.5/"
}

var currentCityCoords = { lat: "-34.93", lon: "138.6" }

var cityArray = [];

//This will put our array into local storage
function storeSearches() {
    localStorage.setItem("cities", JSON.stringify(cityArray));
}

//Adds searched cities to then be added as a list of buttons on the page
function createList() {
    $(buttonContainer).empty();
    cityArray.forEach(function (city) {
        $(buttonContainer).prepend($(`<button class = "prevSearchButton" data-city="${city}">${city}</button>`));
    })
}

// document.addEventListener('click', button);

// function button(event) {
//     prevSearchButtonEl = EventTarget;
//         getTodayResults(prevSearchButtonEl).val();
//         getForecastResults(prevSearchButtonEl).val();
// }
//ability to clear saved buttons and array ***not working
function clearList() {
    $(clearButtonEl).on("click", cityArray.empty());
}

//On site load, the last stored city is called through the API for current and forecast functions
function load() {
    var storedSearches = JSON.parse(localStorage.getItem("cities"));

    if (storedSearches !== null) {
        cityArray = storedSearches;
        createList();
    } else cityArray = ["adelaide"]

    if (cityArray) {
        var currentCity = cityArray[cityArray.length - 1]
        getTodayResults(currentCity, api.key);
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
        $(cityInputEl).val('');
    }
}

function getTodayResults(query) {
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(weatherCurrent => {
            return weatherCurrent.json();
        }).then(displayTodayResults);
}

function displayTodayResults(weatherCurrent) {
    console.log(weatherCurrent);
    $(cityTitleEl).text(weatherCurrent.name) && (weatherCurrent.sys.country);
    $(currentDateEl).text(moment(weatherCurrent.dt, 'X').format('DD MMMM YYYY'));
    $(currentIconEl).attr("src", `https://openweathermap.org/img/wn/${weatherCurrent.weather[0].icon}@2x.png`);
    $(currentTempEl).text(weatherCurrent.main.temp.toFixed(0) + "°c");
    $(currentHumidEl).text(weatherCurrent.main.humidity + " %");
    $(currentWindEl).text(weatherCurrent.wind.speed + " m/s");
    $(currentWeatherEl).text(weatherCurrent.weather[0].main);
    var currentCityCoordsLat = weatherCurrent.coord.lat;
    var currentCityCoordsLon = weatherCurrent.coord.lon;
    console.log(currentCityCoordsLat);
    console.log(currentCityCoordsLon);

    //Query for UV index then fill page
    function UVcall(query) {
        fetch(`${api.base}uvi?APPID=${api.key}&lat=${currentCityCoordsLat}&lon=${currentCityCoordsLon}`)
            .then(UVcurrent => {
                return UVcurrent.json();
            }).then(displayUVresults);
    }

    function displayUVresults(UVcurrent) {
        let uvValue = +UVcurrent.value;
        let uvRatingColour = uvValue < 2
            ? "green"
            : uvValue < 5
                ? "yellow"
                : uvValue < 7
                    ? "orange"
                    : uvValue < 10
                        ? "red"
                        : "crimson";
        currentUvEl.innerHTML = `<span style="color:${uvRatingColour}">${uvValue}</span>`;
    };
    UVcall();
}

function getForecastResults(query) {
    fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
        .then(weatherFore => {
            return weatherFore.json();
        }).then(displayForecastResults);
}

function displayForecastResults(weatherFore) {
    console.log(weatherFore);

    while (forecastEl.childElementCount) {
        forecastEl.removeChild(forecastEl.childNodes[0]);
    }

    let intervals = weatherFore.list;

    let i = 0;
    let foreCastArray = [];

    intervals.forEach(entry => {
        let timeOfEntry = moment(entry.dt, 'X');

        if (foreCastArray[i]) {

            if (foreCastArray[i].date.isSame(timeOfEntry, 'day')) {

                if (foreCastArray[i].temp < entry.main.temp) {
                    foreCastArray[i] = {
                        date: timeOfEntry,
                        dateString: timeOfEntry.format('DD/MM/YYYY'),
                        temp: entry.main.temp,
                        humidity: entry.main.humidity,
                        weather: entry.weather[0].icon

                    };
                }

            } else {
                i++;
                foreCastArray[i] = {
                    date: timeOfEntry,
                    dateString: timeOfEntry.format('DD/MM/YYYY'),
                    temp: entry.main.temp,
                    humidity: entry.main.humidity,
                    weather: entry.weather[0].icon
                };

            }

        } else if (timeOfEntry.isAfter(moment(), 'day')) {
            foreCastArray[i] = {
                date: timeOfEntry,
                dateString: timeOfEntry.format('DD/MM/YYYY'),
                temp: entry.main.temp,
                humidity: entry.main.humidity,
                weather: entry.weather[0].icon
            };
        }
        console.log(`Date: ${timeOfEntry}, Temperature: ${entry.main.temp}`);
    })
    console.log(foreCastArray);
    createForecast(foreCastArray);
};



const createForecast = (forecastArray) =>

    forecastArray.forEach(data => {
        console.log(data);

        let dayForecast = $("<div>")
            .addClass(".forecast-box");

        let forecastHead = $("<h2>")
            .addClass(".current-date")
            .text(data.date.format('dddd'))
            dayForecast.append(forecastHead);

        let forecastIcon = $("<img>")
            .attr("src", `https://openweathermap.org/img/wn/${data.weather}@2x.png`)
            dayForecast.append(forecastIcon);

        let boxTemp = $("<p>")
            .addClass(".current-wind")
            .text(data.temp.toFixed(0) + "°c")
            dayForecast.append(boxTemp);

        forecastEl.appendChild(dayForecast);
    });
//Calls the last stored if it exists, to the initial screen
load();
