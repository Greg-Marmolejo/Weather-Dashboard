// global variables
const apiKeyOpenWeather = "2fb02c7aa049104e9c50b0827ae0fae4";      // store api keys
const apiKeyOpenCage = "d716dc2f151f464d814d382c7945fb36";

var cityList = $("#city-list");
var cityArray = [];

function getLatLong() {
    navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        getCity(lat,lon);
    });
}

function getCity(lat,lon) {
  var LAT = lat;
  var LNG = lon;

var queryCity = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=` + apiKeyOpenCage;

$.ajax({
url: queryCity, 
method: "GET",
dataType: "json",

}).then(function (response) { 
var city=response.results[0].components.city;
updateDashboard(city);
});
}

function updateDashboard(city) {      //function expects city everytime it's refreshed.  Gets called 3 times
  // 1. Upon loading page.
  // 2. Searching for a new city.
  // 3. When city buttons in list are clicked.

    var queryCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKeyOpenWeather + "&units=imperial";

    $.ajax({
      url: queryCurrent,
      method: "GET",
      dataType: "json",
  
    }).then(function (response) {
    /// response is an object with an object inside called main.
      var formattedDate = moment.unix(response.dt).format(" ddd, MMM Do")

  $("#city-heading").text(response.name + " - ");
  $("#date").text(formattedDate);
  $("#current-temperature").text("Temperature: " + Math.floor(response.main.temp));
  $("#current-humidity").text("Humidity: " + response.main.humidity + "%");
  $("#current-wind-speed").text("Wind Speed: " + Math.floor(response.wind.speed) + "mph");
});

updateCurrentUV(city);

var queryURL5day = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKeyOpenWeather + "&units=imperial";
  $.ajax({
    url: queryURL5day,
    method: "GET",
    dataType: "json",

  }).then(function (response) {
    /// response is an object with a property called list that's an array. 

    for (var i = 0; i < 40; i += 8) {
      var formattedFiveDate = moment.unix(response.list[i].dt).format(" ddd, MMM Do")
      var tempFiveDay = Math.floor(response.list[i].main.temp);
      var humidityFiveDay = response.list[i].main.humidity;
      var icon = response.list[i].weather[0].icon;
      var idx = (i / 8) + 1;

      $("#date" + idx).text(formattedFiveDate);
      $("#icon" + idx).attr("src", "https://openweathermap.org/img/w/" + icon + ".png")
      $("#day" + idx + "-temp").text("Temperature: " + tempFiveDay);
      $("#day" + idx + "-humidity").text("Humidity: " + humidityFiveDay);  
    }
  });
  saveCity(city);
}

function updateCurrentUV(city) {
  var queryLatLon= `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${apiKeyOpenCage}`;
  $.ajax({
    url: queryLatLon,
    method: "GET",
    dataType: "json",

}).then(function (response) { // returns lat and lon
  var lat = response.results[0].geometry.lat;
  var lon = response.results[0].geometry.lng;

  var queryURLuv = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKeyOpenWeather}&units=imperial`;
  $.ajax({
      url: queryURLuv,
      method: "GET",
      dataType: "json",
  
  }).then(function (response) { // update uv-index field
      $("#current-uv-index").text("UV Index: " + response.value);
  })
})
}

function saveCity(city) {
  if (cityArray.indexOf(city) === -1) {
// Puts the city in local storage.
// localStorage.setItem("city", city);

// pushes city into cityArray
cityArray.push(city);
console.log(cityArray);
var cityBtn = `<button type="button" class="btn btn-secondary cityBtn" data-city=${city}>${city}</button>`;
// template literal
cityList.append(cityBtn);
  }
}

// event handler for return key
$("#searchCity").keypress(function (event) {

  if (event.keyCode === 13) {
    event.preventDefault();
    $("#searchBtn").click();
  }
});

// event handler for search button
$("#searchBtn").on("click", function () {

  // get the value of the input from user
  var city = $("#searchCity").val();
  event.preventDefault();
  updateDashboard(city);
});

// event handler for cityBtn
cityList.on("click", ".cityBtn", function (event) {
  var city = $(this).attr("data-city");
  console.log(city);
  updateDashboard(city);
});

getLatLong();