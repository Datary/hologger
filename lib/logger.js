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
,   LogentriesStreamer      = require("./logentries-streamer")
,   AppinsightsStreamer     = require("./appinsights-streamer")
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
    this._streamer;
    switch (strategy) {
        case "Local": this._streamer = new LocalStreamer(library, isbn); break;
        case "Logentries": this._streamer = new LogentriesStreamer(library, isbn); break;
        case "Appinsights": this._streamer = new AppinsightsStreamer(library, isbn); break;
        default: break;
    }
    
    this.debug      = this._streamer.debug;
    this.info       = this._streamer.notice;
    this.notice     = this._streamer.notice;
    this.warning    = this._streamer.warning;
    this.error      = this._streamer.error;
    this.critical   = this._streamer.critical;
    this.alert      = this._streamer.alert;
    this.emergency  = this._streamer.emergency;
}



module.exports = Logger;