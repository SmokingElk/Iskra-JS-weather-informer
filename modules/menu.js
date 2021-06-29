const Menu = function () {
	this.config = {
		updateTime: 500,

		precision: 1,

		padding: 2,
		preparingTextFontSize: 14,
		cityFontSize: 13,
		temperatureFontSize: 15,

		towns: [
			"London",
			"Moscow",
			"Phoenix",
		],
	};

	this.width = 128;
	this.height = 64;

	this.netReady = false;

	this.weatherData = require("weatherData").create();
	this.imgs = require("imgs").imgs;

	this.createCanvas();
	this.prepareButtons();
	this.loop();
};

Menu.prototype.createCanvas = function () {
	PrimaryI2C.setup({
		sda: SDA, 
		scl: SCL, 
		bitrate: 400000
	});

	this.ctx = require("SSD1306").connect(PrimaryI2C);
};

Menu.prototype.prepareButtons = function () {
	let src = this;
	const button = require("button");
	button.connect(P7).on("press", () => src.before());
	button.connect(P6).on("press", () => src.next());
};

Menu.prototype.before = function () {
	let l = this.config.towns.length;
	let id = (this.config.towns.indexOf(this.weatherData.city) - 1 + l) % l;
	this.weatherData.setCity(this.config.towns[id]);
};

Menu.prototype.next = function () {
	let l = this.config.towns.length;
	let id = (this.config.towns.indexOf(this.weatherData.city) + 1 + l) % l;
	this.weatherData.setCity(this.config.towns[id]);
};

Menu.prototype.drawPreparingText = function () {
	this.ctx.setFontVector(this.config.preparingTextFontSize);
	this.ctx.drawString("connection to", this.config.padding, 0);
	this.ctx.drawString("the internet", this.config.padding, this.height * 0.25);
	this.ctx.drawString("service:", this.config.padding, this.height * 0.5);
	this.ctx.drawString("open weather", this.config.padding, this.height * 0.75);
};

Menu.prototype.drawCityName = function () {
	this.ctx.setFontVector(this.config.cityFontSize);
	this.ctx.drawString(this.weatherData.city, this.config.padding, this.config.padding);
};

Menu.prototype.drawWeatherData = function () {
	let data = this.weatherData.getData();
	if (data === null) return;

	this.ctx.setFontVector(this.config.temperatureFontSize);
	this.ctx.drawString(data.main.temp.toFixed(this.config.precision) + " C", this.config.padding, this.height * 0.5 - this.config.temperatureFontSize * 0.5);

	let imageName = data.weather[0].main;

	if (!(imageName in this.imgs)) return;

	let img = Graphics.createImage(this.imgs[imageName]);
	
	this.ctx.drawImage(img, this.width * 0.5, this.config.padding);
	this.ctx.setColor(0, 0, 0);
	this.ctx.fillRect(this.width * 0.5 + 50, 0, this.width, this.height);
	this.ctx.setColor(1, 1, 1);
};

Menu.prototype.loop = function () {
	this.ctx.clear();

	if (this.netReady) {
		this.drawCityName();
		this.drawWeatherData();
	} else {
		this.drawPreparingText();
	}

	this.ctx.flip();
	setTimeout(() => this.loop(), this.config.updateTime);
};

Menu.prototype.start = function () {
	this.weatherData.start();
	this.netReady = true;
};

exports.create = function () {
	return new Menu();
};
