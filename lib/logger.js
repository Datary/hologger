/*******************************************************************************
 * @description
 * Clase Logger
 * 
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/connection.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error/validation.js
 * @vid https://github.com/rapid7/le_node/blob/master/src/logger.js
 */
var util                    = require('util')
,   LocalStreamer           = require("./local-streamer")
,   LogentriesStreamer      = require("./logentries-streamer")
,   AppinsightsStreamer     = require("./appinsights-streamer")
;



/*******************************************************************************
 * `Logger` constructor.
 *
 * @api public
 * 
 * @param {String} strategy: tipo de estrategia de logueo a emplear, esto es,
 * el cliente que se empleara (local, logentries...)
 * @param {Object} library:
 * @param {Number} isbn:
 */
function Logger(strategy, library, isbn){
    this._strategy = strategy || "Local";
    this._library = library || {};
    this._isbn = isbn || 666;
    this._streamer;
    switch (strategy) {
        case "Local": this._streamer = new LocalStreamer(library, isbn); break;
        case "Logentries": this._streamer = new LogentriesStreamer(library, isbn); break;
        case "Appinsights": this._streamer = new AppinsightsStreamer(library, isbn); break;
        default: break;
    }
    
    this.debug      = this._streamer.debug.bind(this._streamer);
    this.info       = this._streamer.info.bind(this._streamer);
    this.notice     = this._streamer.notice.bind(this._streamer);
    this.warning    = this._streamer.warning.bind(this._streamer);
    this.error      = this._streamer.error.bind(this._streamer);
    this.critical   = this._streamer.critical.bind(this._streamer);
    this.alert      = this._streamer.alert.bind(this._streamer);
    this.emergency  = this._streamer.emergency.bind(this._streamer);
}



module.exports = Logger;