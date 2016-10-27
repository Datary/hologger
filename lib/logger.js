/*******************************************************************************
 * @description
 * Clase Logger
 * 
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/connection.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error/validation.js
 */
var util                = require('util')
,   localStreamer       = require("./local-streamer")
,   remoteStreamer      = require("./remote-streamer")
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
    
    switch (strategy) {
        case "Local":
            //var Streamer = new LocalStreamer(library, isbn)
            this.debug      = localStreamer("debug", this.library, this.isbn);
            this.info       = localStreamer("info", this.library, this.isbn);
            this.notice     = localStreamer("notice", this.library, this.isbn);
            this.warning    = localStreamer("warning", this.library, this.isbn);
            this.error      = localStreamer("error", this.library, this.isbn);
            this.critical   = localStreamer("critical", this.library, this.isbn);
            this.alert      = localStreamer("alert", this.library, this.isbn);
            this.emergency  = localStreamer("emergency", this.library, this.isbn);
            break;
        
        case "Logentries":
            //var Streamer = new LocalStreamer(library, isbn)
            this.debug      = remoteStreamer("debug", library, isbn);
            this.info       = remoteStreamer("info", library, isbn);
            this.notice     = remoteStreamer("notice", library, isbn);
            this.warning    = remoteStreamer("warning", library, isbn);
            this.error      = remoteStreamer("error", library, isbn);
            this.critical   = remoteStreamer("critical", library, isbn);
            this.alert      = remoteStreamer("alert", library, isbn);
            this.emergency  = remoteStreamer("emergency", library, isbn);
            break;
        
        default:
            return;
    }
}



Logger.prototype.foo = "bar";
// Logger.prototype.debug      = Streamer.debug;
// Logger.prototype.info       = Streamer.notice;
// Logger.prototype.notice     = Streamer.notice;
// Logger.prototype.warning    = Streamer.warning;
// Logger.prototype.error      = Streamer.error;
// Logger.prototype.critical   = Streamer.critical;
// Logger.prototype.alert      = Streamer.alert;
// Logger.prototype.emergency  = Streamer.emergency;



module.exports = Logger;