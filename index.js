/***************************************************************************
 * @description
 * 
 * emergency;    // 8xxxxxxx
 * alert;        // 7xxxxxxx
 * critical;     // 6xxxxxxx
 * error;        // 5xxxxxxx
 * warning;      // 4xxxxxxx
 * notice;       // 3xxxxxxx
 * info;         // 2xxxxxxx
 * debug;        // 1xxxxxxx
 ***************************************************************************/
var Logentries      = require('le_node')
,   chalk           = require('chalk')
,   _               = require('lodash')
,   handlebars      = require('handlebars')
,   fakeClient      = require("./lib/fake")
,   genuineClient   = require("./lib/genuine")
;



const LOCAL_OUTPUT_ONLY = !process.env.LOGENTRIES_TOKEN;
try {
    const CONFIG = {};
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
    const LOGENTRIES_CLIENT = new Logentries(CONFIG);
    console.log("Yeah! Logentries instantation succeded!");
    LOGENTRIES_CLIENT.on("error", (e) => LOGENTRIES_CLIENT.critical("[XXXXXXXX] [Unsuccessfully connect to Logentries", e));
} catch (e) {
    console.log("Ouch! Logentries instantation failed!");
}
module.exports = (LOCAL_OUTPUT_ONLY)? fakeClient : genuineClient;