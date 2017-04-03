//create the variables needed for the html fields
var city = document.getElementById("city");
var temp = document.getElementById("temp");
var description = document.getElementById("description");
var icon = document.getElementById("icon");
var tempUnit = document.getElementById("tempUnit");
var unitButton = document.getElementById("unitBtn");
//weather must be declared here to be used in switchUnit() and success()
var weather;

//function for temperature button click
function switchUnit() {
  if (tempUnit.innerHTML == "C") {
    tempUnit.innerHTML = "F";
    temp.innerHTML = Math.floor(weather.main.temp * (9 / 5) + 32) + "&deg;";
  } else {
    tempUnit.innerHTML = "C";
    temp.innerHTML = Math.floor(weather.main.temp) + "&deg;";
  }
}

//function for geolocation success
function success(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  //due to chrome's new security parameters, http wont work for geolocation
  //have to use crossorigin.me to make it work
  var apiCall = "https://cors-everywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&appid=316ae28d3d1fb20d0f91983861b3f0a3";

  //create request to weather api
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      //weather contains the response as an object
      weather = JSON.parse(xhr.responseText);

      city.innerHTML = weather.name;
      description.innerHTML = weather.weather[0].description;
      temp.innerHTML = Math.floor(weather.main.temp) + "&deg;";
      
      //temperature unit and button show up after loading only
      tempUnit.innerHTML = "C";
      unitButton.style.visibility="visible";
      //using weathericons because of its compatibility with openweathermap
      var iconStr = "wi wi-owm-" + weather.weather[0].id;
      icon.setAttribute("class", iconStr);
    }
  };

  xhr.open("GET", apiCall, true);
  xhr.send();

};

//function for geolocation error
function error(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      city.innerHTML = "User denied the request for Geolocation. If using Google Chrome, make sure you use https."
      break;
    case error.POSITION_UNAVAILABLE:
      city.innerHTML = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      city.innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      city.innerHTML = "An unknown error occurred."
      break;
  }
};

//geolocation call
navigator.geolocation.getCurrentPosition(success, error);