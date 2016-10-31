/*******************************************************************************
 * @description
 * Clase `Streamer`
 * 
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/connection.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error/validation.js
 */
var util            = require('util')
,   _               = require('lodash')
,   chalk           = require('chalk')
,   handlebars      = require('handlebars')
;



/*******************************************************************************
 * `Streamer` constructor.
 *
 * @api public
 * 
 * @param {Nomber} library: identificador numerico que identifica la libreria 
 * de codigos empleada
 * @param {Nomber} isbn: identificador numerico que identifica la libreria 
 * de codigos empleada
 */
function Streamer(library, isbn){
    this._name = "Streamer";
    this._description = "Streamer constructor";
    this._library = library;
    this._isbn = isbn;
    
    this.debug      = this._write("debug");
    this.info       = this._write("info");
    this.notice     = this._write("notice");
    this.warning    = this._write("warning");
    this.error      = this._write("error");
    this.critical   = this._write("critical");
    this.alert      = this._write("alert");
    this.emergency  = this._write("emergency");
}



/*******************************************************************************
 * @description:
 * 
 * @param {Mixed} info:
 * 
 * @TODO info deberia poder ser solo Object o String 
 * @TODO event deberia ser Number
 */
Streamer.prototype._validate = function(info){
    info = info || {};
    if (_.isString(info)) { info = {str: info} }        //estandarizacion de String a Object
};



/*******************************************************************************
 * @description
 * 
 * @param {String} level:
 * @param {Number} event: identificador numerico del evento que se desea 
 * registrar
 * 
 * @return 
 */
Streamer.prototype._composeCode = function(level, event){
    var LEVEL_CODE;
    switch (level) {
        case 'debug': LEVEL_CODE = 1*10000000; break;
        case 'info': LEVEL_CODE = 2*10000000; break;
        case 'notice': LEVEL_CODE = 3*10000000; break;
        case 'warning': LEVEL_CODE = 4*10000000; break;
        case 'error': LEVEL_CODE = 5*10000000; break;
        case 'critical': LEVEL_CODE = 6*10000000; break;
        case 'alert': LEVEL_CODE = 7*10000000; break;
        case 'emergency': LEVEL_CODE = 8*10000000; break;
        default: break;
    }
    const LIBRARY_CODE  = this._isbn*10000;
    const EVENT_CODE    = event;
    const FULL_CODE     = LEVEL_CODE + LIBRARY_CODE + EVENT_CODE;
    
    return FULL_CODE;
};



/*******************************************************************************
 * @description
 * 
 * @param {String} level:
 * @param {Number} event: identificador numerico del evento que se desea 
 * registrar
 * @param {Mixed} info:
 * 
 * @return 
 */
Streamer.prototype._composeMessage = function(level, event, info){
    var MESSAGE;
    try {
        MESSAGE = handlebars.compile(this._library[level][event])(info);
    } catch (e) {
        MESSAGE = "=========EVENT CODE MALFORMED: " + level + "/" + event + "==========";
    }
    return MESSAGE;
};



/*******************************************************************************
 * @description
 * 
 */
Streamer.prototype._compose = function(level, event, info){
    const FULL_CODE = this._composeCode(level, event);
    const MESSAGE = this._composeMessage(level, event, info);
    const SLUG = "[" + FULL_CODE + "] [" + MESSAGE + "]";
    
    return SLUG;
};



/*******************************************************************************
 * @description
 * 
 */
Streamer.prototype._siftRequest = function(req){
    const REQUEST = {};
    
    /////// Basicas
    const SIFTING_PROPS = [
        "_parsedUrl", "_remoteAddress", "baseUrl", "complete", "cookies", "domain", 
        "endpoint", "headers", "httpVersion", "originalUrl", "method",
        "params", "query", "signedCookies", "statusCode", "statusMessage", 
        "url", "user", "authToken", "encodedAuthToken"
    ];
    SIFTING_PROPS.forEach((e)=>{REQUEST[e]=req[e]});
    
    /////// Exoticas (analizar con cuidado)
    if (req.connection) {
        REQUEST.connection = {};
        if (req.connection._peername) { REQUEST.connection._peername = req.connection._peername }
        if (req.connection.ip) { REQUEST.ip = req.connection.ip }
    }
    
    /////// body !!!Ojo, puede petarme logentries en peticiones grandes
    if (req.body) {
        REQUEST.body = req.body;
        _.unset(REQUEST, 'body.slug');
    }
    
    return REQUEST;
};



/*******************************************************************************
 * @description
 * 
 */
Streamer.prototype._write = function(level){
    return function(slug){
        
    }
    
    ///////// LOCAL STREAMER
    //logueo un String (slug) 
    console.log(slug);
    if (info && info.error) { 
        console.log("====================STACK BEGINS===================");
        console.log(info.error.stack);
        console.log("====================STACK ENDS===================");
    }
    
    
    ///////// REMOTE STREAMER
    //segun el entorno, logueo un String (slug) o un Object (info)
    if (process.env.RACK_ENV === "development"){
        CLIENT[level](slug);
        //@vid description
        if (info && info.error) {
            console.log("====================STACK BEGINS===================");
            console.log(info.error.stack);
            console.log("====================STACK ENDS===================");
        } 
    } else {
        info.severity   = level;
        info.library    = isbn;
        info.code       = event;
        info.fullCode   = FULL_CODE;
        info.eventSlug  = slug;
        //if (info && info.error) info.response = ERROR_CODES[info.error];
        CLIENT[level](info);
    }
};



module.exports = Streamer;