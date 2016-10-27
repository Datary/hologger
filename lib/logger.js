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



/**
 * `Logger` constructor.
 *
 * @api public
 * 
 * @param {String} strategy:
 * @param {Object} library:
 * @param {Number} isbn:
 */
function Logger(strategy, library, isbn){
    this.strategy = strategy || "Local";
    this.library = library || {};
    this.isbn = isbn || 666;
    
    var Streamer;
    switch (strategy) {
        case "Local": return Streamer = new LocalStreamer(library, isbn);
        case "Logentries": return Streamer = new remoteStreamer(library, isbn);
        case "ApplicationInsights" return Streamer = new remoteStreamer(library, isbn);
        default:
            return;
    }
}



Logger.prototype.debug      = Streamer.debug;
Logger.prototype.info       = Streamer.notice;
Logger.prototype.notice     = Streamer.notice;
Logger.prototype.warning    = Streamer.warning;
Logger.prototype.error      = Streamer.error;
Logger.prototype.critical   = Streamer.critical;
Logger.prototype.alert      = Streamer.alert;
Logger.prototype.emergency  = Streamer.emergency;



module.exports = Logger;