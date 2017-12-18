/**
 * Module dependencies.
 */
var LocalStreamer = require('hologger-local');




/**
 * @api public
 *
 * 
 * @description
 * `Logger` constructor.
 *
 * 
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/connection.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error/validation.js
 * @vid https://github.com/rapid7/le_node/blob/master/src/logger.js
 * 
 */
function Logger(library, isil){
    this._library = library || {};
    this._isil = isil || null;
    this._streamers = {};
    this._streamer = null;

    this.init();
}




/**
 * @api protected
 *
 *
 * @description
 * Initialize `Logger`.
 */
Logger.prototype.init = function(){
    //streamer pre-definido
    this.enable(new LocalStreamer());
    this.default("Local");


    //
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
 * Genera una instancia de Hologger que hereda el contexto completo de la 
 * invocante. Realiza un clon, en otras palabras.
 */
Logger.prototype.spawn = function(){
    return Object.create(this);
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
 *     hologger.enable(new LocalStreamer(...));
 *     hologger.enable('console', new LocalStreamer(...));
 *
 * 
 * @param {String|Streamer} name
 * @param {Streamer} streamer
 *
 * 
 * @return {Logger} for chaining
 */
Logger.prototype.enable = function(name, streamer){
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
 * and de-configure streamer.  The `enable()`/`disable()`combination satisfies 
 * these scenarios.
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
Logger.prototype.disable = function(name){
    delete this._streamers[name];
    return this;
};




/**
 * @api public
 *
 * 
 * @description
 * Set the given `streamer` as the default Streamer, so that any logging will 
 * occur through it unless otherwise specified.
 *
 * Examples:
 *
 *     hologger.default('Local')
 *
 * 
 * @param {String}          name of the {Streamer}
 *
 * 
 * @return {Logger} for chaining
 */
Logger.prototype.default = function(name){
    if (!name) throw new Error('A name is required in order to set a Streamer as default');
    if (!this._streamers[name]) throw new Error('Streamer ' + name + ' has not been enabled yet');
  
    this._streamer = this._streamers[name];
    return this;
};




/**
 * @api public
 *
 * 
 * @description
 *
 * 
 * Examples:
 *
 *     hologger.attach({});
 *
 * 
 * @param {Number} isil             identificador numerico de la libreria
 * @param {Object} library          conjunto de pares clave-valor, en que las 
 * primeras representan codigos de logueo y los segundo mensajes de texto asociados
 * a aquellos
 *
 * 
 * @return {Logger} for chaining
 */
Logger.prototype.attach = function(isil, library){
    //isil es opcional
    if (arguments.length === 1) {
        library = arguments[0];
        isil = null;
        console.warn("[HOLOGGER] ISIL not provided. Current library codes may be overwritten during attach.");
    } else if (typeof isil !== "string") {
        console.warn("[HOLOGGER] ISIL provided is not {String} and will be ignored. Current library codes may get overwritten during attach.");
        isil = null;
    }

    if (!isil) {
        for (let prop in library) {
            this._library[prop] = library[prop];
        }
    } else {
        this._library[isil] = library;
    }

    return this;
};




/**
 * Expose `Logger`.
 */
module.exports = Logger;