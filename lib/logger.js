/*******************************************************************************
 * `Logger` constructor.
 *
 * @api public
 * 
 * @param {String} strategy: tipo de estrategia de logueo a emplear, esto es,
 * el cliente que se empleara (local, logentries...)
 * @param {Object} library:
 * @param {Number} isil: dentificador numerico de la libreria
 *
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/connection.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error/validation.js
 * @vid https://github.com/rapid7/le_node/blob/master/src/logger.js
 * 
 */
function Logger(strategy, library, isil){
    var LocalStreamer           = require("./local-streamer");
    var LogentriesStreamer      = require("./logentries-streamer");
    var AppinsightsStreamer     = require("./appinsights-streamer");


    this._strategy = strategy || "Local";
    this._library = library || {};
    this._isil = isil || null;
    this._streamer;
    switch (strategy) {
        case "Local": this._streamer = new LocalStreamer(library, isil); break;
        case "Logentries": this._streamer = new LogentriesStreamer(library, isil); break;
        case "Appinsights": this._streamer = new AppinsightsStreamer(library, isil); break;
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