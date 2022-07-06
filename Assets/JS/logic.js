// Define the HTML elements we will use in JS
let APIKey = 'cf4280e902da44b2517b6186d055cd7c';
// API call to get current weather info and lon and lat to call future forcast function
const getCityForecast = (city) => {
    // Changes URL to insert city in query parameter
    apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
    // Calls API
    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // Logs API call to console
                console.log(data);
                // if city has not been searched before - add it to search history
                if (state.previous_search.indexOf(city.trim()) < 0) {
                    state.previous_search.push(city.trim());
                    saveState();
                    renderPreviousSearchList();
                }
                // gets icon code for current weather
                let iconCode = data.weather[0].icon;
                // concatenates code into url
                let iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
                // Gets weather icon
                let weatherIcon = document.getElementById('weatherIcon');
                // Sets icons source to iconURL to render icon
                weatherIcon.setAttribute('src',iconURL);
                // Renders all current weather info to todayResults section
                document.getElementById('cityName').innerHTML = city;
                let today = moment().format('MM-DD-YY');
                document.getElementById('dateToday').innerHTML = "(" + today + ")";
                document.getElementById('tempToday').innerHTML = "Temp: " + (data.main.temp - 273.15).toFixed(2) + ' °C';
                document.getElementById('windToday').innerHTML = "Wind: " + data.wind.speed + " M/Hr";
                document.getElementById('humidityToday').innerHTML = "Humidity: " + data.main.humidity;
                // Calls futureWeather function with long and lat as parameters
                let lon = data.coord.lon;
                let lat = data.coord.lat;
                oneCall(lat, lon);
            });
        } else {
            alert('Invalid city name.\nPlease check your spelling and try again.')
            console.log("Not a good response there must be an error eeeek!");
        }
    });
};
// API call to get 5 day forecast and UV Index
const oneCall = (lat, lon) => {
    // Defines new URL
    let newAPIURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${APIKey}`;
    // Gets API data
    fetch(newAPIURL).then(function (response) {
        if(response.ok) {
            response.json().then(function(data) {
                // Do all the stuff here
                console.log(data);
                // Adds UV index to Daily Forcast
                let UVIndex = data.current.uvi;
                document.getElementById('UVIndexToday').innerHTML = UVIndex;
                // Adds class to style UV index based on UV index value
                document.getElementById('UVIndexToday').setAttribute('class',getUVIndexStyling(UVIndex));
                // loops through next 5 days and renders weather details
                for (let i = 0; i < 5; i++) {
                    // Changes Date to relevant day
                    document.getElementById("dateDay" + (i + 1)).textContent = moment().add(i + 1, 'd').format('DD-MM-YY');
                    // gets icon code for current weather
                    let iconCode = data.daily[i].weather[0].icon;
                    // concatenates code into url
                    let iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
                    // Sets the src of the icon element to iconURL
                    document.getElementById('weatherIconDay' + (i + 1)).setAttribute('src',iconURL);
                    // Renders Temp on page
                    let temp = (data.daily[i].temp.day - 273.15).toFixed(2)
                    document.getElementById('tempDay' + (i + 1)).textContent = `Temp:\n${temp} °C`;
                    // Renders Wind on page
                    document.getElementById('windDay' + (i + 1)).textContent = 'Wind:\n' + data.daily[i].wind_speed + ' M/Hr';
                    // Renders Humidity on page
                    document.getElementById('humidityDay' + (i + 1)).textContent = 'Humidity:\n' + data.daily[i].humidity;
                }
            })
        }
        // clears search input
        document.getElementById('userCityInput').value = "";
    })
    // displays information
    document.getElementById("searchResultsContainer").style.visibility = "visible";
};
// Styles UV index based conditionally 
const getUVIndexStyling = (value) => {
    if (value <= 2) {
        return 'low';
    } else if (value <= 5) {
        return 'moderate';
    } else if (value <= 7) {
        return 'high';
    } else if (value <= 10) {
        return 'very-high';
    } else {
        return 'extreme';
    }
};
// Defines local storage object
let state = {
    previous_search: []
};
// Gets data from local storage
function loadState() {
    let json = localStorage.getItem("Weather-searches");

    if (json !== null) {
        state = JSON.parse(json);
    }
};
// Saves data to local storage
function saveState() {
    let json = JSON.stringify(state);
    localStorage.setItem("Weather-searches", json);
};
// Renders previous search list
const renderPreviousSearchList = () => {
    document.getElementById('previousSearches').innerHTML = "";
    // Gets local storage
    loadState();
    // loops through state to create previous search history HTML elements
    for (let i = 0; i < state.previous_search.length; i++) {
        // defines search history element
        let previousSearchList = document.getElementById('previousSearches');
        // creates new buttom
        let button = document.createElement('button');
        // Defines the previous search term 
        let previousSearchTerm = state.previous_search[i]
        // makes the buttons text content the previous search
        button.textContent = previousSearchTerm;
        // Adds event listener with parameter of previousSearchTerm 
        button.addEventListener("click", () => {
            getCityForecast(previousSearchTerm);
        });
        // appends to the search history element
        previousSearchList.appendChild(button);
    }
};
// Handles search button click
const handleSearchButtonClick = () => {
    // Defines variable city as the value searched by the user
    let city = document.getElementById('userCityInput').value;
    // calls get city forcast
    getCityForecast(city);
};
// Adds event listener to search button on click
document.getElementById('searchButton').addEventListener('click', handleSearchButtonClick);
// Adds event listener to enter button
window.addEventListener('keydown', (event) => {
    if (event.key ==='Enter') {
        handleSearchButtonClick();
    }
});
// On Page Load
renderPreviousSearchList();
// Hides results section by default
document.getElementById("searchResultsContainer").style.visibility = "hidden";
