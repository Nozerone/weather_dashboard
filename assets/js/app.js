//Openweather API key
const APIkey = "5b7ccc5ba81d4d27f0fdd40dc0cbe778";
const baseUrl = "https://api.openweathermap.org/data/2.5";

var cityInputEl = $("#city-input");
var searchBtn = $("#search-buttom");
var clearBtn = $("#clear-button");
var pastSearchEl = $("#past-search");

var currentCity;

function getWeather(data) {
  var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.lat}&lon=${data.lon}&exclude=minutely,hourly,alerts&units=standard&appid=${APIkey}`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //current weather
      var currentConditionsEl = $("#currentConditions");
      currentConditionsEl.addClass("border border-primary");

      //create city name element/display
      var cityNameEl = $("#currentConditions");
      currentConditionsEl.addClass("boder border-primary");

      //get date from results and display by appending to city name element
      var currentCityDate = data.current.dt;
      var currentCityDate = moment.unix(currentCityDate).format("MM/DD/YYYY");
      currentDateEl.text(` (${currentCityDate}) `);
      cityNameEl.append(currentDateEl);

      //get weather icon and display
      var currentCityWeatherIcon = data.current.weather[0].icon;
      var currentWeatherIconEl = $("<img>");
      currentWeatherIconEl.attr(
        "src",
        "http://openweathermao.org/img/wn/" + currentCityWeatherIcon + ".png"
      );
      cityNameEl.append(currentWeatherIconEl);

      //get current temp data and display
      var currentCityTemp = data.current.temp;
      var currentTempEl = $("<p>");
      currentTempEl.text(` Temp: ${currentCityTemp}°F `);
      currentConditionsEl.append(currentTempEl);

      //get current wind speed and display
      var currentCityWindSpeed = data.current.wind_speed;
      var currentWindEl = $("<p>");
      currentWindEl.text(` Humidity: ${currentCityWindSpeed} MPH `);
      currentConditionsEl.append(currentWindEl);

      //get current UV index and background color based on lever and display
      var currentCityUv = data.current.uvi;
      var currentUvEl = $("<p>");
      var currentUvSpanEl = $("<span>");
      currentUvEl.append(currentUvSpanEl);
      currentUvSpanEl.text(` UV: ${currentCityUv} `);

      if (currentCityUv < 3) {
        currentUvEl.css({
          "background-color": "green",
          color: "white",
        });
      } else if (currentCityUv < 6) {
        currentUvSpanEl.css({
          "background-color": "yellow",
          color: "black",
        });
      } else if (currentCityUv < 8) {
        currentUvSpanEl.css({
          "background-color": "orange",
          color: "white",
        });
      } else if (currentCityUv < 11) {
        currentUvSpanEl.css({
          "background-color": "red",
          color: "white",
        });
      } else {
        currentUvEl.css({ "background-color": "violet", color: "white" });
      }

      currentConditionsEl.append(currentUvEl);

      // 5 - Day Forecast
      // create 5 Day Forecast <h2> header
      var fiveDayForecastHeaderEl = $("#fiveDayForecastHeader");
      var fiveDayHeaderEl = $("<h2>");
      fiveDayHeaderEl.text("5-Day Forecast:");
      fiveDayForecastHeaderEl.append(fiveDayHeaderEl);

      var fiveDayForecastEl = $("#fiveDayForecast");

      // get key weather info from API data for five day forecast and display
      for (var i = 1; i <= 5; i++) {
        var date;
        var temp;
        var icon;
        var wind;
        var humidity;

        date = data.daily[i].dt;
        date = moment.unix(date).format("MM/DD/YYYY");

        temp = data.daily[i].temp.day;
        icon = data.daily[i].weather[0].icon;
        wind = data.daily[i].wind_speed;
        humidity = data.daily[i].humidity;

        // create a card
        var card = document.createElement("div");
        card.classList.add("card", "col-2", "m-1", "bg-primary", "text-white");

        // create card body and append
        var cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        cardBody.innerHTML = `<h6>${date}</h6>
                                      <img src= "http://openweathermap.org/img/wn/${icon}.png"> </><br>
                                       ${temp}°F <br>
                                       ${wind} MPH <br>
                                       ${humidity}%`;

        card.appendChild(cardBody);
        fiveDayForecastEl.append(card);
      }
    })

    .catch(function (error) {
      console.error("Error:", error);
    });

  return;
}

// Display search history as buttons
function displaySearchHistory() {
  var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
  var pastSearchesEl = document.getElementById("past-searches");

  pastSearchesEl.innerHTML = "";

  for (i = 0; i < storedCities.length; i++) {
    var pastCityBtn = document.createElement("button");
    pastCityBtn.classList.add("btn", "btn-primary", "my-2", "past-city");
    pastCityBtn.setAttribute("style", "width: 100%");
    pastCityBtn.textContent = `${storedCities[i].city}`;
    pastSearchesEl.appendChild(pastCityBtn);
  }
  return;
}

// use Open Weather 'Current weather data (API)' to get city coordinates to then send to 'One Call API' to get weather
function getCoordinates() {
  var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${APIkey}`;
  var storedCities = JSON.parse(localStorage.getItem("cities")) || [];

  fetch(requestUrl)
    .then(function (response) {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (data) {
      var cityInfo = {
        city: currentCity,
        lon: data.coord.lon,
        lat: data.coord.lat,
      };

      storedCities.push(cityInfo);
      localStorage.setItem("cities", JSON.stringify(storedCities));

      displaySearchHistory();

      return cityInfo;
    })
    .then(function (data) {
      getWeather(data);
    });
  return;
}

// handle request to clear search history
function handleClearHistory(event) {
  event.preventDefault();
  var pastSearchesEl = document.getElementById("past-searches");

  localStorage.removeItem("cities");
  pastSearchesEl.innerHTML = "";

  return;
}

function clearCurrentCityWeather() {
  var currentConditionsEl = document.getElementById("currentConditions");
  currentConditionsEl.innerHTML = "";

  var fiveDayForecastHeaderEl = document.getElementById(
    "fiveDayForecastHeader"
  );
  fiveDayForecastHeaderEl.innerHTML = "";

  var fiveDayForecastEl = document.getElementById("fiveDayForecast");
  fiveDayForecastEl.innerHTML = "";

  return;
}

// handle submit of city name by trimming and sending to getCoordinates function, clear HTML display of past weather data, cards, titles
function handleCityFormSubmit(event) {
  event.preventDefault();
  currentCity = cityInputEl.val().trim();

  clearCurrentCityWeather();
  getCoordinates();

  return;
}

// When user clicks on city previously searched, an updated forecast will be retrieved and displayed
function getPastCity(event) {
  var element = event.target;

  if (element.matches(".past-city")) {
    currentCity = element.textContent;

    clearCurrentCityWeather();

    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${APIkey}`;

    fetch(requestUrl)
      .then(function (response) {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          throw Error(response.statusText);
        }
      })
      .then(function (data) {
        var cityInfo = {
          city: currentCity,
          lon: data.coord.lon,
          lat: data.coord.lat,
        };
        return cityInfo;
      })
      .then(function (data) {
        getWeather(data);
      });
  }
  return;
}

displaySearchHistory();

searchBtn.on("click", handleCityFormSubmit);

clearBtn.on("click", handleClearHistory);

pastSearchEl.on("click", getPastCity);
