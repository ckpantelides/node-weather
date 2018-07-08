const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
var geoip = require('geoip-lite');

// Use the environment variable or use a given port
const PORT = process.env.PORT || 8080;

// Create a server, uses `handleRequest` which is function that takes
// care of providing requested data
const server = http.createServer(handleRequest);

// darksky weather api key
const apiKey = '71c3cf1a1b7f6003b89a311cd64c8c9d';
// google geocode api key
const googleKey = 'AIzaSyDKXRyAAjVhJQ6xP9C2AVpKjeQk9CYNHlw';

// make static files available i.e. css
app.use(express.static('public'));

// serves all requests which includes /images in the url from the images folder
app.use('/images', express.static(__dirname + '/Images'));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var lat = "";
var lon = "";

// route for initial page load
app.get('/', function (req, res) {

  // request IP address for location geocoding
  var ip = req.ip;
  // geocode with geoip-lite
  var geo = geoip.lookup(ip);

  // find lat & lon using geoip; default to London if lookup fails
  var lat = geo ? geo.ll[0] : '51.5074';
  var lon = geo ? geo.ll[1] : '0.1278';

  // url for weather api call
  let url = `https://api.darksky.net/forecast/${apiKey}/${lat},${lon}?units=si`;

  request(url, function (err, response, body) {

    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    }
    // function to get weather
    else {
      let weather = JSON.parse(body)
        if(weather.currently == undefined) {
          res.render('index', {weather: null, error: 'Error, please try again'});
          }
        else {

          // current temp in celsius and fahrenheit
          let tempC = Math.round(weather.currently.temperature);
          let tempF = (Math.round(1.8*(weather.currently.temperature)) + 32);
          // get current location name from geoip, or default to darksky's timezone
          let name = geo ? geo.city : weather.timezone;

          // weather icon and summary for current weather
          let icon = '<img src="/images/' + weather.currently.icon + '.svg" alt="weather icon">';
          let summary = weather.hourly.summary;

          // empty array for hourly updates (celsius and then fahrenheit)
          var hourly = [];
          var hourlyF = [];
          // loop for hourly updates
           for(var i = 0; i < 24; i++) {
             // populate array for the hourly celcius update
             hourly.push({
             // hour of each update
             'time_hourly': (new Date(weather.hourly.data[i].time * 1000)).getHours(),

             // icon for each hourly update
             'icon_hourly': '<img src ="/images/' + weather.hourly.data[i].icon + '.svg">',

             // temp in celsius for each hourly update
             'temp_hourly': Math.round(weather.hourly.data[i].temperature),

              });
              // populate array for the hourly Fahrenheit update
              hourlyF.push({
              // hour of each update
              'time_hourly': (new Date(weather.hourly.data[i].time * 1000)).getHours(),

              // icon for each hourly update
               'icon_hourly': '<img src ="/images/' + weather.hourly.data[i].icon + '.svg">',

               // temp in fahrenheit for each hourly update
               'temp_hourly': (Math.round(1.8*(weather.hourly.data[i].temperature)) + 32),

              });
            }

              // empty array for daily updates (celsius and then fahrenheit)
              var daily = [];
              var dailyF = [];

              // loop for daily updates
              for(var j=1; j<8; j++) {

                // get day of week
                var timestamp = weather.daily.data[j].time;
                var a = new Date(timestamp*1000);
                var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                var dayOfWeek = days[a.getDay()];

                daily.push({

                  'day': dayOfWeek,

                  // icon for each daily update
                  'icon_daily': '<img src = images/' + weather.daily.data[j].icon + '.svg>',

                  // temp in celsius for each daily update
                  'temp_daily': Math.round(weather.daily.data[j].temperatureHigh ),
                  });

                dailyF.push({

                  'day': dayOfWeek,

                  // icon for each daily update
                  'icon_daily': '<img src = images/' + weather.daily.data[j].icon + '.svg>',

                  // temp in fahrenheit for each hourly update
                  'temp_daily': Math.round(1.8*(weather.daily.data[j].temperatureHigh)) + 32,
                });

              }

          res.render('index', {tempC: tempC, tempF: tempF, name: name, icon: icon,
            summary: summary, hourly: hourly, hourlyF: hourlyF, daily: daily, dailyF: dailyF, error: null});
          }
        }
      });
    })

// route if html reached by post (i.e. after search)
app.post('/', function (req, res, getWeather) {

  // takes search value and geocodes it using google API
  var newSearch = req.body.searchInput;

  var geoUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="
  + newSearch + "&key=" + googleKey;

  request(geoUrl, function (err, response, body) {

    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    }
    // if geocode a success, gets weather
    else {
      let geodata = JSON.parse(body);
          let name = geodata.results[0].address_components[1].long_name;
          var lat = geodata.results[0].geometry.location.lat;
          var lon = geodata.results[0].geometry.location.lng;

          let url = `https://api.darksky.net/forecast/${apiKey}/${lat},${lon}?units=si`;

          request(url, function (err, response, body) {

            if(err){
              res.render('index', {weather: null, error: 'Error, please try again'});
            }

            else {
              let weather = JSON.parse(body);
              if(weather.currently === undefined) {
                res.render('index', {weather: null, error: 'Error, please try again'});
              }
              else {

                let tempC = Math.round(weather.currently.temperature);
                let tempF = (Math.round(1.8*(weather.currently.temperature)) + 32);
      //        let name = weather.timezone;

                let icon = '<img src="/images/' + weather.currently.icon + '.svg" alt="weather icon">';
                let summary = weather.hourly.summary;

                // empty array for hourly updates (Celsius and then Fahrenheit)
                var hourly = [];
                var hourlyF = [];
                // loop for hourly updates
                for(var i = 0; i < 24; i++) {
                  // populate array for the hourly Celcius update
                  hourly.push({
                    // hour of each update
                    'time_hourly': (new Date(weather.hourly.data[i].time * 1000)).getHours(),

                    // icon for each hourly update
                    'icon_hourly': '<img src ="/images/' + weather.hourly.data[i].icon + '.svg">',

                    // temp in celsius for each hourly update
                    'temp_hourly': Math.round(weather.hourly.data[i].temperature),

                  });
                  // populate array for the hourly Fahrenheit update
                  hourlyF.push({
                    // hour of each update
                    'time_hourly': (new Date(weather.hourly.data[i].time * 1000)).getHours(),

                    // icon for each hourly update
                    'icon_hourly': '<img src ="/images/' + weather.hourly.data[i].icon + '.svg">',

                    // temp in fahrenheit for each hourly update
                    'temp_hourly': (Math.round(1.8*(weather.hourly.data[i].temperature)) + 32),

                    });
                  }

                  // empty array for daily updates (Celsius and then Fahrenheit)
                  var daily = [];
                  var dailyF = [];

                  // loop for daily updates
                  for(var j=1; j<8; j++) {

                    // get day of week
                    var timestamp = weather.daily.data[j].time;
                    var a = new Date(timestamp*1000);
                    var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                    var dayOfWeek = days[a.getDay()];

                    daily.push({

                      'day': dayOfWeek,

                      // icon for each daily update
                      'icon_daily': '<img src = images/' + weather.daily.data[j].icon + '.svg>',

                      // temp in celsius for each daily update
                      'temp_daily': Math.round(weather.daily.data[j].temperatureHigh ),
                    });

                    dailyF.push({

                      'day': dayOfWeek,

                      // icon for each daily update
                      'icon_daily': '<img src = images/' + weather.daily.data[j].icon + '.svg>',

                      // temp in fahrenheit for each hourly update
                      'temp_daily': Math.round(1.8*(weather.daily.data[j].temperatureHigh)) + 32,
                    });
                  }
                  res.render('index', { tempC: tempC, tempF: tempF, name: name, icon: icon, summary: summary,
                    hourly: hourly, hourlyF: hourlyF, daily: daily, dailyF: dailyF, error: null});
              }
            }
          });
        }
      });
    });
/*
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
*/

// Start the server
server.listen(PORT, () => {
  console.log('Server listening on: http://localhost:%s', PORT);
});
