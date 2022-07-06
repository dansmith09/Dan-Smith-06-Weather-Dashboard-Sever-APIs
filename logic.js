// Define the HTML elements we will use in JS
var APIKey = 'cf4280e902da44b2517b6186d055cd7c';

var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=Sydney&appid=${APIKey}`;
// Get data from API
// Make html content based on API data
// Save previous searches to storage

var getCityForecast = function(city) {
    // Changes URL to insert city in query parameter
    apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
    // Calls API
    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // Logs API call to console
                console.log(data);
                // gets icon code for current weather
                var iconCode = data.weather[0].icon;
                // concatenates code into url
                var iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
                // Gets weather icon
                var weatherIcon = document.getElementById('weatherIcon');
                // Sets icons source to iconURL to render icon
                weatherIcon.setAttribute('src',iconURL);
                // Gets city name and changes heading to the city name
                document.getElementById('cityName').innerHTML = city;
                var today = moment().format('MM-DD-YY');
                document.getElementById('dateToday').innerHTML = "(" + today + ")";
                document.getElementById('tempToday').innerHTML = "Temp: " + (data.main.temp - 273.15).toFixed(2) + ' °C';
                document.getElementById('windToday').innerHTML = "Wind: " + data.wind.speed;
                document.getElementById('humidityToday').innerHTML = "Humidity: " + data.main.humidity;
                document.getElementById('UVIndexToday').innerHTML = "UV Index: " + city;
                // Calls futureWeather function with long and lat as parameters
                var lon = data.coord.lon;
                var lat = data.coord.lat;
                oneCall(lat, lon);
                // Logs API URL
                console.log(`api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=5&appid=${APIKey}`);

            });
        } else {
            console.log("Not a good response there must be an error eeeek!");
        }
    });
}

const oneCall = (lat, lon) => {
    var newAPIURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${APIKey}`;

    fetch(newAPIURL).then(function (response) {
        if(response.ok) {
            response.json().then(function(data) {
                // Do all the stuff here
                console.log(data);
                console.log(data.daily[0].wind_speed);
                // First Block

            })
        }
    })
}


// Search Button Function 
