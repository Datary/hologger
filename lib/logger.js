/**
 * Module dependencies.
 */




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
    this._enabledStreamers = new Set();

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
    this.debug      = demux("debug");
    this.info       = demux("info");
    this.notice     = demux("notice");
    this.warning    = demux("warning");
    this.error      = demux("error");
    this.critical   = demux("critical");
    this.alert      = demux("alert");
    this.emergency  = demux("emergency");

    //distribuye la peticion de logueo a todos los {Streamers} habilitados
    var streamers = this._streamers;
    var enabledStreamers = this._enabledStreamers;
    function demux(level){
        return function(){
            for (let streamer in streamers) {
                if (!enabledStreamers.has(streamer)) return;
                else streamers[streamer][level].apply(streamers[streamer],arguments);
            }
        };
    }
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
 * 
 * @description
 * Configures `streamer` for further uses with optional `name`, overridding 
 * the streamer's default name.
 *
 * Examples:
 *
 *     hologger.configure(new LocalStreamer(...));
 *     hologger.configure('console', new LocalStreamer(...));
 *
 * 
 * @param {String|Streamer} name
 * @param {Streamer} streamer
 *
 * 
 * @return {Logger} for chaining
 */
Logger.prototype.configure = function(name, streamer){
    if (arguments.length === 1) {
        streamer = arguments[0];
        name = streamer.name || streamer._name;
        if (!name) throw new Error('Streamer strategies must have a name');
    }
    
    this._streamers[name] = streamer;

    return this;
};




/**
 * @api public
 *
 * 
 * @description 
 * Enables the given `streamer` for further use.   
 *
 * Examples:
 *
 *     hologger.enable('local');
 *
 * 
 * @param {String} streamer         Nombre del {Streamer} que se desea habilitar
 *
 * 
 * @returns {Logger}                Made available for chaining
 */
Logger.prototype.enable = function(streamer){
    this._enabledStreamers.add(streamer);
    return this;
};




/**
 * @api public
 *
 * 
 * @description 
 * Disable the `streamer` with given name.
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
 * @param {String} stream           Nombre del {Streamer} que se desea deshabilitar
 * 
 * 
 * @return {Logger} for chaining
 */
Logger.prototype.disable = function(stream){
    this._enabledStreamers.delete(stream);
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
        let msg = "[HOLOGGER] ISIL not provided. ";
        msg += "Current library codes may get overwritten during attach.";
        console.warn(msg);
    } else if (typeof isil !== "string" && typeof isil !== "number") {
        let msg = "[HOLOGGER] ISIL provided is not {String} or {Number} and will be ignored. ";
        msg += "Current library codes may get overwritten during attachment.";
        console.warn(msg);
        isil = null;
    }

    //
    if (!isil) {
        for (let prop in library) {
            this._library[prop] = library[prop];
        }
    } else {
        this._library[isil] = library;
    }
    
    //allows chaining
    return this;
};




/**
 * @api public
 * 
 * @description 
 * Selecciona un subconjunto de la biblioteca de codigos como libreria de codigos
 * a emplear
 *
 * @param {String} isil         identificador de la sub-biblioteca de codigos a 
 * seleccionar
 *
 * @return {Logger} for chaining
 */
Logger.prototype.use = function(isil){
    if (typeof isil !== "string") {
        let msg = "[HOLOGGER] ISIL provided is not {String} and will be ignored. ";
        msg += "Global library will be used.";
        console.warn(msg);
    } else if (!this._library[isil]) {
        let msg = "[HOLOGGER] ISIL provided is not available in the library and will be ignored. ";
        msg += "Global library will be used.";
        console.warn(msg);
    } else {
        this._library = this._library[isil];
    }

    //allows chaining
    return this;
};




/**
 * Expose `Logger`.
 */
module.exports = Logger;