var today = new Date();
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var todaysWeatherEl = document.querySelector("#todays-weather");
var todaysWeatherCardEl = document.querySelector("#todays-weather-card")
var fiveDayCardEl = document.querySelector("#five-day-card");
var fiveDayEl = document.querySelector("#five-day-body");
var weatherStatusEl = document.querySelector("#weather-status");
var searchEl = document.querySelector("#search");
var historyButtonsEl = document.querySelector("#history-buttons")
var historyCardEl = document.querySelector("#history")
var searchHistoryArray = []


var formSubmitHandler = function (event) {
    event.preventDefault();
    // Get city name
    var city = cityInputEl.value.trim();
    // Send city name to local storage
    if (city) {
        searchHistoryArray.push(city);
        localStorage.setItem("weatherSearch", JSON.stringify(searchHistoryArray));
        var searchHistoryEl = document.createElement('button');
        searchHistoryEl.className = "btn";
        searchHistoryEl.setAttribute("data-city", city)
        searchHistoryEl.innerHTML = city;
        historyButtonsEl.appendChild(searchHistoryEl);
        historyCardEl.removeAttribute("style")
        getWeatherInfo(city);
        cityInputEl.value = "";
    }
    else {
        alert("Please enter a City name");
    }
}

// Get OpenWeather info
var getWeatherInfo = function (city) {
    var apiCityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=a88d4d486dba92af95a9bfebf10b6c2a";
    fetch(
        // City name fetch request
        apiCityUrl
    )
        .then(function (cityResponse) {
            return cityResponse.json();
        })
        .then(function (cityResponse) {
            // Latitude and longitude variables of requested city
            console.log(cityResponse)
            var latitude = cityResponse.coord.lat;
            var longitude = cityResponse.coord.lon;

             // City name, current date, and icon information variables for Current Weather heading
            var city = cityResponse.name;
            var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
            var weatherIcon = cityResponse.weather[0].icon;
            var weatherDescription = cityResponse.weather[0].description;
            var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title='" + weatherDescription + "'  />"
           
            todaysWeatherEl.textContent = "";
            fiveDayEl.textContent = "";

            weatherStatusEl.innerHTML = city + " (" + date + ") " + weatherIconLink;

            todaysWeatherCardEl.classList.remove("hidden");
            fiveDayCardEl.classList.remove("hidden");

            // Return fetch request
            return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=alerts,minutely,hourly&units=imperial&appid=f97301447cbd41068af8623a398ba1fb');
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            displayWeather(response);
        });
};

// Display weather
var displayWeather = function (weather) {
    // Check if api returned any weather data
    if (weather.length === 0) {
        weatherContainerEl.textContent = "No weather data found.";
        return;
    }
    // Create Temperature element
    var temperature = document.createElement('p');
    temperature.id = "temperature";
    temperature.innerHTML = "<strong>Temperature:</strong> " + weather.current.temp.toFixed(1) + "°F";
    todaysWeatherEl.appendChild(temperature);

    // Create Humidity element
    var humidity = document.createElement('p');
    humidity.id = "humidity";
    humidity.innerHTML = "<strong>Humidity:</strong> " + weather.current.humidity + "%";
    todaysWeatherEl.appendChild(humidity);

    // Create Wind Speed element
    var windSpeed = document.createElement('p');
    windSpeed.id = "wind-speed";
    windSpeed.innerHTML = "<strong>Wind Speed:</strong> " + weather.current.wind_speed.toFixed(1) + " MPH";
    todaysWeatherEl.appendChild(windSpeed);

    var forecastArray = weather.daily;
    // Create cards for 5-day forecast
    for (let i = 0; i < forecastArray.length - 3; i++) {
        var date = (today.getMonth() + 1) + '/' + (today.getDate() + i + 1) + '/' + today.getFullYear();
        var weatherIcon = forecastArray[i].weather[0].icon;
        var weatherDescription = forecastArray[i].weather[0].description;
        var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title='" + weatherDescription + "'  />"
        var dayEl = document.createElement("div");
        dayEl.className = "day";
        dayEl.innerHTML = "<p><strong>" + date + "</strong></p>" +
            "<p>" + weatherIconLink + "</p>" +
            "<p><strong>Temp:</strong> " + forecastArray[i].temp.day.toFixed(1) + "°F</p>" +
            "<p><strong>Humidity:</strong> " + forecastArray[i].humidity + "%</p>"
        fiveDayEl.appendChild(dayEl);
    }
}

var loadHistory = function () {
    searchArray = JSON.parse(localStorage.getItem("weatherSearch"));
    if (searchArray) {
        searchHistoryArray = JSON.parse(localStorage.getItem("weatherSearch"));
        for (let i = 0; i < searchArray.length; i++) {
            var searchHistoryEl = document.createElement('button');
            searchHistoryEl.className = "btn";
            searchHistoryEl.setAttribute("data-city", searchArray[i])
            searchHistoryEl.innerHTML = searchArray[i];
            historyButtonsEl.appendChild(searchHistoryEl);
            historyCardEl.removeAttribute("style");
        }
    }
}

var buttonClickHandler = function (event) {
    var city = event.target.getAttribute("data-city");
    if (city) {
        getWeatherInfo(city);
    }
}

var clearHistory = function (event) {
    localStorage.removeItem("weatherSearch");
    historyCardEl.setAttribute("style", "display: none");
}

cityFormEl.addEventListener("submit", formSubmitHandler);
historyButtonsEl.addEventListener("click", buttonClickHandler);
trashEl.addEventListener("click", clearHistory);

loadHistory();