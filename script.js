// global variables
var city = "Your Location";                  // store the value of the input
const apiKey = "2fb02c7aa049104e9c50b0827ae0fae4";      // store api key

// var cityHeading = $("#city-heading");
// var date = $("#date");
var currentTemperature = $("#current-temperature");
var currentHumidity = $("#current-humidity");
var currentWindSpeed = $("#current-wind-speed");
var currentUVIndex = $("#current-uv-index");
var appendToMe = $("#append-to-me");

function saveCity () {
    // Puts the city in local storage.
    localStorage.setItem("city", city);
    // var cityDiv = $("<div>" + city + "</div>");
    // cityDiv.addClass
    var cityBtn = `<button type="button" class="btn btn-secondary">${city}</button>`; // template literal
    appendToMe.append(cityBtn);
    // cityDiv.setAttribute("style", "text-align: center;");  // this isn't working
    
    // Gets city everytime it's refreshed.
// Updates Dashboard.
    // updateDashboard();
};

function updateDashboard (data, type) { //function expects JSON data and string of type (either 5day or current)
// gets cities everytime it's refreshed.  Gets called 3 times
// 1. couldn't read handwriting.
// 2. searching for a new city
// 3. Cities in list
    if (type === 'current'){
        $("#city-heading").text(data.name);
        $("#date").text(data.dt);
    }
    }

function getCity () {
// Updates the list.  Gets called twice.    
}

// event handler for return key
$("#searchCity").keypress(function (event) {

  if (event.keyCode === 13) {
    event.preventDefault();
    $("#searchBtn").click();
  }
});

// event handler for search button
$("#searchBtn").on("click",function () {

  // get the value of the input from user
  city = $("#searchCity").val();
  event.preventDefault();
  
  // full url to call api
    var queryURLcurrent = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
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

var queryURL5day = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";
$.ajax({
    url: queryURL5day,
    method: "GET",
    dataType: "json",
    
  }).then(function (response) {

    var fiveDayResult = response;
    console.log(fiveDayResult);
    updateDashboard(fiveDayResult, "five-day")
});

saveCity();

});


function getCoordinates() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        //api.openweathermap.org/data/2.5/weather?lat=35&lon=139
        var queryURLcurrent = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    
      $.ajax({
        url: queryURLcurrent,
        method: "GET",
        dataType: "json",
        
      }).then(function (response) {
    
        var currentResult = response;
        console.log(currentResult);
        updateDashboard(currentResult, 'current');
        
     });
    });
            
}

getCoordinates();
// clear input box
// $("#searchCity").val(""); 
