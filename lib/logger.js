/*******************************************************************************
 * @description
 * Clase Logger
 * 
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/connection.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error/validation.js
 */
var util                    = require('util')
,   localStreamer           = require("./local-streamer")
,   remoteStreamer          = require("./remote-streamer")
;



/*******************************************************************************
 * `Logger` constructor.
 *
 * @api public
 * 
 * @param {String} strategy:
 * @param {Object} library:
 * @param {Number} isbn:
 */
function Logger(strategy, library, isbn){
    this._strategy = strategy || "Local";
    this._library = library || {};
    this._isbn = isbn || 666;
    
    var Streamer;
    switch (strategy) {
        case "Local": Streamer = new LocalStreamer(library, isbn); break;
        case "Logentries": Streamer = new remoteStreamer(library, isbn); break;
        case "ApplicationInsights": Streamer = new remoteStreamer(library, isbn); break;
        default: break;
    }
    
    this.debug      = Streamer.debug;
    this.info       = Streamer.notice;
    this.notice     = Streamer.notice;
    this.warning    = Streamer.warning;
    this.error      = Streamer.error;
    this.critical   = Streamer.critical;
    this.alert      = Streamer.alert;
    this.emergency  = Streamer.emergency;
}



module.exports = Logger;