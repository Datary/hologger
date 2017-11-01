/**
 * Module dependencies.
 */
var LocalStreamer               = require('hologger-local');
var LogentriesStreamer          = require('hologger-logentries');
var ApplicationInsightsStreamer = require('hologger-applicationinsights');




/**
 * @description
 * `Logger` constructor.
 *
 * 
 * @api public
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
    this._strategies = {};
    this._streamers = {};

    this._strategy = strategy || "Local";
    this._streamer;

    this.init(strategy, library, isil);
}




/**
 * Initialize `Logger`.
 *
 * 
 * @api protected
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
 * @description
 * Enable the given `streamer` for further user with optional `name`, overridding 
 * the streamer's default name.
 *
 * Examples:
 *
 *     hologger.use(new LocalStreamer(...));
 *
 *     hologger.use('console', new LocalStrategy(...));
 *
 * 
 * @param {String|Strategy} name
 * @param {Strategy} strategy
 *
 * 
 * @return {Authenticator} for chaining
 *
 * 
 * @api public
 */
Logger.prototype.enable = function(name, strategy) {
  if (!strategy) {
    strategy = name;
    name = strategy.name;
  }
  if (!name) { throw new Error('Streamer strategies must have a name'); }
  
  this._strategies[name] = strategy;
  return this;
};




/**
 * Expose `Logger`.
 */
module.exports = Logger;