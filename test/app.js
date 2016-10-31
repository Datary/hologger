//lectura de variables de entorno
var env = require('node-env-file');
env(__dirname + '/.env');



//importacion
var hologger    = require("../index")(require("./logger.json"));



//realizo los test
hologger.debug(1, "foo");
hologger.info(1, "foo");
hologger.notice(1, "foo");
hologger.warning(1, "foo");
hologger.error(1, "foo");
hologger.critical(1, "foo");
hologger.alert(1, "foo");
hologger.emergency(1, "foo");

hologger.debug(2, {member: "debug"});
hologger.info(2, {member: "info"});
hologger.notice(2, {member: "notice"});
hologger.warning(2, {member: "warning"});
hologger.error(2, {member: "error"});
hologger.critical(2, {member: "critical"});
hologger.alert(2, {member: "alert"});
hologger.emergency(2, {member: "emergency"});