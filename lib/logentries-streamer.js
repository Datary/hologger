var Logentries      = require('le_node')
,   Streamer        = require("./streamer")
;




/*******************************************************************************
 * @description
 * RemoteStreamer constructor
 * 
 * @api private
 * @inherits Streamer
 *
 * @param {Object} library: libreria de codigos empleada
 * @param {Nomber} isil: identificador numerico de la libreria de codigos empleada
 */
function LogentriesStreamer(library, isil){
    Streamer.call(this, library, isil);
    
    this._name = "LogentriesStreamer";
    this._description = "LogentriesStreamer constructor";
    
    const CONFIG = {
        token: process.env.LOGENTRIES_TOKEN,
        console: false,
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
        LOGENTRIES_CLIENT.on("error", (e)=>console.log("[XXXXXXXX] [Unsuccessfully connect to Logentries", e));
        this._debugDrain = LOGENTRIES_CLIENT.debug.bind(LOGENTRIES_CLIENT);
        this._infoDrain = LOGENTRIES_CLIENT.info.bind(LOGENTRIES_CLIENT);
        this._noticeDrain = LOGENTRIES_CLIENT.notice.bind(LOGENTRIES_CLIENT);
        this._warningDrain = LOGENTRIES_CLIENT.warning.bind(LOGENTRIES_CLIENT);
        this._errorDrain = LOGENTRIES_CLIENT.error.bind(LOGENTRIES_CLIENT);
        this._criticalDrain = LOGENTRIES_CLIENT.critical.bind(LOGENTRIES_CLIENT);
        this._alertDrain = LOGENTRIES_CLIENT.alert.bind(LOGENTRIES_CLIENT);
        this._emergencyDrain = LOGENTRIES_CLIENT.emergency.bind(LOGENTRIES_CLIENT);
    } catch (e) {
        return new Error();
    }
}



/////// INHERITS FROM STREAMER 
LogentriesStreamer.prototype = Object.create(Streamer.prototype);
LogentriesStreamer.prototype.constructor = Streamer;



/*******************************************************************************
 * @description
 * Sobreescribe el metodo de la clase `Streamer`.
 * Envia la informacion como Object o como String, ya que Logentries permite 
 * el procesamiento de Objects anidados sin problemas
 * 
 * @param {} gate:
 * @param {Mixed} info:
 */
LogentriesStreamer.prototype._log = function(gate, info){ return gate(info); };



/////// MODULE EXPORTS 
module.exports = exports = LogentriesStreamer;