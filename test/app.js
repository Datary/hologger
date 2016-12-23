//lectura de variables de entorno
var env = require('node-env-file');
env(__dirname + '/.env');



//importacion
var hologger = require("../index")(require("./logger.json"));


//finalizacion
console.log("===================BEGIN TEST");
console.log("Using " + hologger._strategy + " strategy");



//realizo los test
hologger.debug("foo");
hologger.info("foo");
hologger.notice("foo");
hologger.warning("foo");
hologger.error("foo");
hologger.critical("foo");
hologger.alert("foo");
hologger.emergency("foo");

hologger.debug(1, {foo: "bar"});
hologger.info(1, {foo: "bar"});
hologger.notice(1, {foo: "bar"});
hologger.warning(1, {foo: "bar"});
hologger.error(1, {foo: "bar"});
hologger.critical(1, {foo: "bar"});
hologger.alert(1, {foo: "bar"});
hologger.emergency(1, {foo: "bar"});



//finalizacion
console.log("===================END TEST");