const WeatherData = function () {
	this.config = {
		token: "***",
		units: "metric",
		updateTime: 15000,
	};

	this.ready = false;
	this.data = {};
	this.city = "London";

	this.http = require("http");
};

WeatherData.prototype.setCity = function (city) {
	clearTimeout(this.timeoutId);
	this.city = city;
	this.ready = false;
	this.update();
};

WeatherData.prototype.update = function () {
	let url = `http://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.config.token}&units=${this.config.units}`;
	let src = this;

	this.http.get(url, function (res) {
		let contents = "";
  		res.on('data', data => contents += data);
  		res.on('close', function () {
  			src.data = JSON.parse(contents);
  			src.ready = true;
  		});
	});

	this.timeoutId = setTimeout(() => this.update(), this.config.updateTime);
};

WeatherData.prototype.start = function () {
	this.update();
};

WeatherData.prototype.getData = function () {
	return this.ready ? this.data : null;
};

exports.create = function () {
	return new WeatherData();
};
