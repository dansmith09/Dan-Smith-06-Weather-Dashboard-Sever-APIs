// Define the HTML elements we will use in JS
var APIKey = 'cf4280e902da44b2517b6186d055cd7c';

var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=Sydney&appid=${APIKey}`;
// Get data from API
// Make html content based on API data
// Save previous searches to storage

fetch(apiURL).then(function (response) {
    if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          console.log(data.weather[0].icon);
            var iconCode = data.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
            var newPic = document.createElement('img');
            newPic.setAttribute('src',iconURL);
            document.querySelector('header').appendChild(newPic);
        });
    }
});

// How do we get the future days from API call
