Weather App
=================

It's hosted [here](https://kyriweather.herokuapp.com/)

A weather app built with node.

I created the user authentication, using the werkzeug package to salt and hash login details. Flask-session ensures the user needs to be logged in to view the routes to add new thoughts etc. It's currently hosted on heroku, with a postgresql database to store the data in relational tables.

![img1]       ![img2]

[img1]: https://github.com/ckpantelides/node-weather/blob/images/weather1.jpg
[img2]: https://github.com/ckpantelides/node-weather/blob/images/weather2.png

#### Installation

> npm install

> node app.js
