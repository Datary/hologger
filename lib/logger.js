/**
 * Module dependencies.
 */
var LocalStreamer               = require('hologger-local');
var LogentriesStreamer          = require('hologger-logentries');
var ApplicationInsightsStreamer = require('hologger-applicationinsights');




/**
 * @api public
 *
 * 
 * @description
 * `Logger` constructor.
 *
 * 
 * @param {String} strategy         tipo de estrategia de logueo a emplear, esto es,
 * el cliente que se empleara (local, logentries...)
 * @param {Object} library          conjunto de pares clave-valor en que las 
 * primeras representan codigos de logueo y los segundo mensajes de texto asociados
 * a aquellos
 * @param {Number} isil             identificador numerico de la libreria
 *
 * 
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/connection.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error/validation.js
 * @vid https://github.com/rapid7/le_node/blob/master/src/logger.js
 * 
 */
function Logger(strategy, library, isil){
    this._library = library || {};
    this._isil = isil || null;
    this._strategy = strategy || "Local";
    this._streamers = {};
    this._streamer;

    this.init(strategy, library, isil);
}




/**
 * @api protected
 *
 *
 * @description
 * Initialize `Logger`.
 */
Logger.prototype.init = function(strategy, library, isil){
    switch (strategy) {
        case "Local": this._streamer = new LocalStreamer(library, isil); break;
        case "Logentries": this._streamer = new LogentriesStreamer(library, isil); break;
        case "ApplicationInsights": this._streamer = new ApplicationInsightsStreamer(library, isil); break;
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
};




/**
 * @api public
 * 
 * @description
 * Enable the given `streamer` for further user with optional `name`, overridding 
 * the streamer's default name.
 *
 * Examples:
 *
 *     hologger.use(new LocalStreamer(...));
 *
 *     hologger.use('console', new LocalStreamer(...));
 *
 * 
 * @param {String|Streamer} name
 * @param {Streamer} streamer
 *
 * 
 * @return {Logger} for chaining
 */
Logger.prototype.enable = function(name, streamer) {
  if (!streamer) {
    streamer = name;
    name = streamer.name;
  }
  if (!name) throw new Error('Streamer strategies must have a name');
  
  this._streamers[name] = streamer;
  return this;
};




/**
 * @api public
 * 
 * 
 * @description 
 * Disable the `streamer` with given `name`.
 *
 * In typical applications, the necessary streamer strategies are static,
 * configured once and always available.  As such, there is often no need to
 * invoke this function.
 *
 * However, in certain situations, applications may need dynamically configure
 * and de-configure streamer strategies.  The `enable()`/`disable()`
 * combination satisfies these scenarios.
 *
 * Examples:
 *
 *     hologger.disable('local');
 *
 * 
 * @param {String} name
 * 
 * 
 * @return {Logger} for chaining
 */
Logger.prototype.disable = function(name) {
  delete this._streamers[name];
  return this;
};




/**
 * Expose `Logger`.
 */
module.exports = Logger;