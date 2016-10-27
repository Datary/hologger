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
    this.strategy = strategy;
    this.library = {};
    this.isbn = isbn;
    
    switch (strategy) {
        case "Local":
            //var Streamer = new LocalStreamer(library, isbn)
            this.debug      = localStreamer("debug");
            this.info       = localStreamer("info");
            this.notice     = localStreamer("notice");
            this.warning    = localStreamer("warning");
            this.error      = localStreamer("error");
            this.critical   = localStreamer("critical");
            this.alert      = localStreamer("alert");
            this.emergency  = localStreamer("emergency");
            break;
        
        case "Logentries":
            //var Streamer = new LocalStreamer(library, isbn)
            this.debug      = remoteStreamer("debug");
            this.info       = remoteStreamer("info");
            this.notice     = remoteStreamer("notice");
            this.warning    = remoteStreamer("warning");
            this.error      = remoteStreamer("error");
            this.critical   = remoteStreamer("critical");
            this.alert      = remoteStreamer("alert");
            this.emergency  = remoteStreamer("emergency");
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