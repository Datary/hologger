/***************************************************************************
 * @description
 * 
 * @param {Object} lib:
 * @param {Number} id: identificador numerico de la libreria
 ***************************************************************************/
var Logger          = require("./lib/logger")
;



module.exports = function(lib, id){
    //@TODO sanity checks
    id = id || 666;
    lib = lib || {};
    process.env = process.env || {};
    strategy = (process.env.LOGENTRIES_TOKEN)?
        "Logentries" : (process.env.APPLICATIONINSIGHTS_INSTRUMENTATIONKEY)?
            "ApplicationInsights": "Local";
    
    return new Logger(strategy, lib, id);
};