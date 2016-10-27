var hologger = require("../index")(require("./logger.json"))
;


hologger.debug(1, {member: "pekebuda"});
hologger.info(1, "foo");