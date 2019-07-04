Weather App
=================

It's hosted [here](https://kyriweather.herokuapp.com/)

#### A weather app built with node & express

It finds your location through an IP lookup. You can toggle between an hourly forecast or a daily forecast, as well as between Celsius and Fahrenheit. You can also search by place name and post-code.

It relies on the DarkCity API for the weather forecast, and on Google's geocode API for the location search. The IP lookup is through the [geoip-lite](https://www.npmjs.com/package/geoip-lite) package

![img1] ![img2]

[img1]: https://github.com/ckpantelides/node-weather/blob/images/weather1.jpg
[img2]: https://github.com/ckpantelides/node-weather/blob/images/weather2.png

#### Installation

> npm install

> node server.js
