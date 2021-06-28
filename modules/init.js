const menu = require("menu").create();

const ssid = "kazarat";
const password = "tekirova";

const wifi = require("@amperka/wifi").setup(function (err) {
  	wifi.connect(ssid, password, function (err) {
    	menu.start();
  	});
});
