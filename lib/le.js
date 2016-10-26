var Logentries      = require('le_node')
;



module.exports = function(){
    const CONFIG = {};
    var LOGENTRIES_CLIENT;
    try {
        CONFIG.token= process.env.LOGENTRIES_TOKEN;
        CONFIG.console= true;
        CONFIG.levels= ["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"];
        CONFIG.minLevel= process.env.LOGENTRIES_LOG_LEVEL || 0;
        CONFIG.bufferSize= 200;
        CONFIG.secure= false;
        CONFIG.flatten= false;
        CONFIG.flattenArrays= false;
        //replacer:
        CONFIG.timestamp= true;
        CONFIG.withLevel= true;
        CONFIG.withStack= true;
        LOGENTRIES_CLIENT = new Logentries(CONFIG);
        LOGENTRIES_CLIENT.on("error", (e) => LOGENTRIES_CLIENT.critical("[XXXXXXXX] [Unsuccessfully connect to Logentries", e));
        console.log("Yeah! Logentries instantation succeded!");
        return LOGENTRIES_CLIENT;
    } catch (e) {
        console.error("Ouch! Logentries instantation failed!");
        return new Error();
    }
};