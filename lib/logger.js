/*******************************************************************************
 * @description
 * Clase Logger
 * 
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/connection.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error/validation.js
 */
var util                = require('util')
,   localStreamer       = require("./lib/local-streamer")
,   remoteStreamer      = require("./lib/remote-streamer")
;



/**
 * `Logger` constructor.
 *
 * @api public
 * 
 * @param {String} strategy:
 * @param {Object} library:
 * @param {Number} id:
 */
function Logger(strategy, library, id){
    this.strategy = strategy;
    this.library = {};
    this.id = id;
    
    switch (strategy) {
        case "Local":
            this.debug      = localStreamer("debug", lib, id);
            this.info       = localStreamer("info", lib, id);
            this.notice     = localStreamer("notice", lib, id);
            this.warning    = localStreamer("warning", lib, id);
            this.error      = localStreamer("error", lib, id);
            this.critical   = localStreamer("critical", lib, id);
            this.alert      = localStreamer("alert", lib, id);
            this.emergency  = localStreamer("emergency", lib, id);
            break;
        
        case "Logentries":
            this.debug      = remoteStreamer("debug", lib, id);
            this.info       = remoteStreamer("info", lib, id);
            this.notice     = remoteStreamer("notice", lib, id);
            this.warning    = remoteStreamer("warning", lib, id);
            this.error      = remoteStreamer("error", lib, id);
            this.critical   = remoteStreamer("critical", lib, id);
            this.alert      = remoteStreamer("alert", lib, id);
            this.emergency  = remoteStreamer("emergency", lib, id);
            break;
        default:
            return;
    }
}



Logger.prototype.foo = "bar";



module.exports = Logger;