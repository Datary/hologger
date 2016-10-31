/*******************************************************************************
 * @description
 * Puesto que en entornos de desarrollo (development) solo se loguea un 
 * mensaje que resume el evento (al contrario que en pre-produccion y en 
 * produccion, donde se almacena como JSON toda la informacion del mismo),
 * en los casos en que el evento contenga un Object de tipo Error, ademas 
 * del slug se loguea explicitamente el stack del Error, pues de otro modo se 
 * pierde la informacion contenida en el mismo, vital para la depuracion 
 * del mismo.
 * 
 * @param {String} level: 
 * 
 * @return {Function}:
 */
var _               = require('lodash') 
,   chalk           = require('chalk')
,   Logentries      = require('le_node')
,   Streamer        = require("./streamer")
;



/*******************************************************************************
 * @description
 * RemoteStreamer constructor
 * 
 * @api private
 * @inherits Streamer
 */
function LogentriesStreamer(library, isbn){
    Streamer.call(this, library, isbn);
    
    this._name = "LogentriesStreamer";
    this._description = "LogentriesStreamer constructor";
    
    const CONFIG = {
        token: process.env.LOGENTRIES_TOKEN,
        console: true,
        levels: ["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"],
        minLevel: process.env.LOGENTRIES_LOG_LEVEL || 0,
        bufferSize: 200,
        secure: false,
        flatten: false,
        flattenArrays: false,
        //replacer:
        timestamp: true,
        withLevel: true,
        withStack: true,
    };
    var LOGENTRIES_CLIENT;
    try {
        LOGENTRIES_CLIENT = new Logentries(CONFIG);
        LOGENTRIES_CLIENT.on("error", (e) => LOGENTRIES_CLIENT.critical("[XXXXXXXX] [Unsuccessfully connect to Logentries", e));
        this._debugDrain = LOGENTRIES_CLIENT.debug;
        this._infoDrain = LOGENTRIES_CLIENT.info;
        this._noticeDrain = LOGENTRIES_CLIENT.notice;
        this._warningDrain = LOGENTRIES_CLIENT.warning;
        this._errorDrain = LOGENTRIES_CLIENT.error;
        this._criticalDrain = LOGENTRIES_CLIENT.critical;
        this._alertDrain = LOGENTRIES_CLIENT.alert;
        this._emergencyDrain = LOGENTRIES_CLIENT.emergency;
    } catch (e) {
        console.error("Ouch! Logentries instantation failed!");
        return new Error();
    }
}



/////// INHERITS FROM STREAMER 
LogentriesStreamer.prototype = Object.create(Streamer.prototype);
LogentriesStreamer.prototype.constructor = Streamer;



/////// MODULE EXPORTS 
module.exports = exports = LogentriesStreamer;