$(document).ready(function(){
/*
navigator.geolocation.getCurrentPosition(function (position) {

  lat = position.coords.latitude;
  lon = position.coords.longitude;
  console.log(lat);
  console.log(lon);

});
*/

// current date
var date = new Date();
var d = date.toDateString();

// append date to html
document.getElementById("date").innerHTML = d;

// toggle between celsius temp and hidden fahrenheit temp
$('.tempIcon').click(function() {
  $('.temp').toggleClass('hidden');
  });

// toggle between search icon and search bar
$('#searchIcon').click(function() {
  $('.search').toggleClass('hidden');
  });

// toggle between hourly update or daily update
$('button').click(function() {
  $('.hourlyDaily').toggleClass('hidden');
  });

});
