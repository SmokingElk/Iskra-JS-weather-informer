const menu = require("menu").create();

const ssid = "***";
const password = "***";

const wifi = require("@amperka/wifi").setup(function (err) {
  	wifi.connect(ssid, password, function (err) {
    	menu.start();
  	});
});
