// global variables
var city = "Your Location";                  // store the value of the input
const apiKey = "2fb02c7aa049104e9c50b0827ae0fae4";      // store api key

var currentUVIndex = $("#current-uv-index");
var appendToMe = $("#append-to-me");

function getWeather(city) {
  if (city) {
    var queryURLcurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    getData(queryURLcurrent, city);

  } else {
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      //api.openweathermap.org/data/2.5/weather?lat=35&lon=139
      var queryURLcurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      getData(queryURLcurrent, "current");
    });
  }
}

function getData(queryURL, str) {
  $.ajax({
    url: queryURL, 
    method: "GET",
    dataType: "json",

  }).then(function (response) {

    var currentResult = response;
    updateDashboard(currentResult, str);

  });
}

function saveCity(city) {
  // Puts the city in local storage.
  localStorage.setItem("city", city);
  // var cityDiv = $("<div>" + city + "</div>");
  // cityDiv.addClass
  var cityBtn = `<button type="button" class="btn btn-secondary cityBtn" data-city=${city}>${city}</button>`; // template literal
  appendToMe.append(cityBtn);

};

function updateDashboard(data, type) { //function expects JSON data and string of type (either 5day or current)
  // gets cities everytime it's refreshed.  Gets called 3 times
  // 1. Upon loading page.
  // 2. Searching for a new city.
  // 3. Cities in list.
  $("#city-heading").text(data.name + " - ");
  console.log(data);
  var formattedDate = moment.unix(data.dt).format(" ddd, MMM Do")
  $("#date").text(formattedDate);
  $("#current-temperature").text("Temperature: " + Math.floor(data.main.temp));
  $("#current-humidity").text("Humidity: " + data.main.humidity);
  $("#current-wind-speed").text("Wind Speed: " + Math.floor(data.wind.speed));

  var city = data.name;
  console.log(city);

  var queryURL5day = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";
  $.ajax({
    url: queryURL5day,
    method: "GET",
    dataType: "json",

  }).then(function (response) {

    console.log(response);
    var fiveDayResult = response;

    /// object with a property called list that's an array. 

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
      // updateDashboard(fiveDayResult, "five-day")
    }

  });
  // }
}

// function getCity () {
// data-city
// Updates the list.  Gets called twice.    
// }

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

  // full url to call api
  var queryURLcurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
  //`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  $.ajax({
    url: queryURLcurrent,
    method: "GET",
    dataType: "json",

  }).then(function (response) {

    var currentResult = response;
    console.log(currentResult);
    updateDashboard(currentResult, 'current');

  });

  saveCity(city);
});

// event handler for cityBtn
appendToMe.on("click", ".cityBtn", function (event) {
  var city = $(this).attr("data-city");

  console.log(city);
  getWeather(city);
});

getWeather();
// clear input box
// $("#searchCity").val(""); 