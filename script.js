// global variables
// var city = "Your Location";                  // store the value of the input
const apiKey = "2fb02c7aa049104e9c50b0827ae0fae4";      // store api key

var currentUVIndex = $("#current-uv-index");
var appendToMe = $("#append-to-me");

function saveCity() {
  // Puts the city in local storage.
  localStorage.setItem("city", city);
  // var cityDiv = $("<div>" + city + "</div>");
  // cityDiv.addClass
  var cityBtn = `<button type="button" class="btn btn-secondary" id="cityBtn">${city}</button>`; // template literal
  appendToMe.append(cityBtn);
  // cityDiv.setAttribute("style", "text-align: center;");  // this isn't working

  // Gets city everytime it's refreshed.
  // Updates Dashboard.
  // updateDashboard();
};

function updateDashboard(data, type) { //function expects JSON data and string of type (either 5day or current)
  // gets cities everytime it's refreshed.  Gets called 3 times
  // 1. couldn't read handwriting.
  // 2. searching for a new city
  // 3. Cities in list
  if (type === 'current') {
    $("#city-heading").text(data.name);
    var formattedDate = moment.unix(data.dt).format(" (M/DD/YYYY)")
    $("#date").text(formattedDate);
    $("#date").text(formattedDate);
    $("#current-temperature").text("Temperature: " + data.main.temp);
    $("#current-humidity").text("Humidity: " + data.main.humidity);
    $("#current-wind-speed").text("Wind Speed: " + data.wind.speed);

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
      var formattedFiveDate = moment.unix(response.list[0].dt).format(" (M/DD/YYYY)")
      var tempFiveDay = response.list[0].main.temp
      var humidityFiveDay = response.list[0].main.humidity
      $("#date1").text(formattedFiveDate);
      $("#day1-temp").text("Temperature: " + tempFiveDay);
      $("#day1-humidity").text("Humidity: " + humidityFiveDay);
      // updateDashboard(fiveDayResult, "five-day")
    });
  }
}

// function getCity () {
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
  city = $("#searchCity").val();
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


  saveCity();

});


function getCoordinates() {
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    //api.openweathermap.org/data/2.5/weather?lat=35&lon=139
    var queryURLcurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    $.ajax({
      url: queryURLcurrent,
      method: "GET",
      dataType: "json",

    }).then(function (response) {

      var currentResult = response;
      updateDashboard(currentResult, 'current');

    });
  });

}

getCoordinates();
// clear input box
// $("#searchCity").val(""); 