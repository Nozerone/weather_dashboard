//Openweather API key
const apikey = '5b7ccc5ba81d4d27f0fdd40dc0cbe778';
const baseUrl = "https://api.openweathermap.org/data/2.5";

var cityInputEl = $('#city-imput');
var searchBtn = $('#search-buttom');
var clearBtn = $('#clear-button');
var pastSearchEl = $('#past-search');

var currentCity;

function getWeather(data) {

    var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.lat}&lon=${data.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${APIkey}`
    
    fetch(requestUrl)
    .then(function(response){
        return response.json();
        })
        .then(function(data) {

            //current weather
            var currentConditionsEl = $('#currentConditions');
            currentConditionsEl.addClass('border border-primary');

            //create city name element/display
            var cityNameEl = $('#currentConditions');
            currentConditionsEl.addClass('boder border-primary');

            //get date from results and display by appending to city name element
            var currentCityDate = data.current.dt;
            var currentCityDate = moment.unix(currentCityDate).format("MM/DD/YYYY");
            currentDateEl.text(` (${currentCityDate}) `);
            cityNameEl.append(currentDateEl);

            //get weather icon and display
            var currentCityWeatherIcon = data.current.weather[0].icon;
            var currentWeatherIconEl = $('<img>');
            currentWeatherIconEl.attr("src", "http://openweathermao.org/img/wn/" + currentCityWeatherIcon + ".png");
            cityNameEl.append(currentWeatherIconEl);

            //get current temp data and display
            var currentCityTemp = data.current.temp;
            var currentTempEl = $('<p>');
            currentTempEl.text(` Temp: ${currentCityTemp}°F `);
            currentConditionsEl.append(currentTempEl);

            //get current wind speed and display
            var currentCityWindSpeed = data.current.wind_speed;
            var currentWindEl = $('<p>');
            currentWindEl.text(` Humidity: ${currentCityWindSpeed} MPH `);
            currentConditionsEl.append(currentWindEl);

            //get current UV index and background color based on lever and display
            var currentCityUv = data.current.uvi;
            var currentUvEl = $('<p>');
            var currentUvSpanEl = $('<span>');
            currentUvEl.append(currentUvSpanEl);
            currentUvSpanEl.text(` UV: ${ currentCityUv } `);

            if (currentCityUv < 3 ) {
                currentUvEl.css({
                    'background-color':'green', 'color':'white'
                });
                
            } else if (currentCityUv < 6 ) {
                currentUvSpanEl.css({
                    'background-color': 'yellow', 'color':'black'
                });
            } else if ( currentCityUv < 8 ) {
                currentUvSpanEl.css({
                'background-color': 'orange', 'color':'white' });

            } else if ( currentCityUv < 11 ) {
                currentUvSpanEl.css({
                    'background-color': 'red', 'color':'white' });
                } else {
                    currentUvEl.css({'background-color': 'violet', 'color':'white'});  
            }

            currentConditionsEl.append(currentUvEl);
            

        })


    })
})