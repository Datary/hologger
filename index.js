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
var Logger          = require("lib/logger")
;



process.env = process.env || {};
strategy = (process.env.LOGENTRIES_TOKEN)?
    "Logentries" : (process.env.APPLICATIONINSIGHTS_INSTRUMENTATIONKEY)?
        "ApplicationInsights": "Local";



module.exports = function(lib, id){
    //id es el codigo que identifica la libreria
    //@TODO sanity checks
    id = id || 666;
    lib = lib || {};
    
    switch(strategy){
        case "Local": 
            return new Logger("Local", lib, id);
        case "Logentries":
            return new Logger("Logentries", lib, id);
        default:
            return new Error();
    }
};