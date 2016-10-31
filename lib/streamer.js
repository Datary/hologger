/*******************************************************************************
 * @description
 * Clase `Streamer`
 * 
 * Puesto que en entornos de desarrollo (development) solo se loguea un 
 * mensaje que resume el evento (al contrario que en pre-produccion y en 
 * produccion, donde se almacena como JSON toda la informacion del mismo),
 * en los casos en que el evento contenga un Object de tipo Error, ademas 
 * del slug se loguea explicitamente el stack del Error, pues de otro modo se 
 * pierde la informacion contenida en el mismo, vital para la depuracion 
 * del mismo.
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
 * @param {Object} library: libreria de codigos empleada
 * @param {Nomber} isbn: identificador numerico de la libreria de codigos empleada
 */
function Streamer(library, isbn){
    this._name = "Streamer";
    this._description = "Streamer constructor";
    this._library = library;
    this._isbn = isbn;
    
    this._debugDrain;
    this._infoDrain;
    this._noticeDrain;
    this._warningDrain;
    this._errorDrain;
    this._criticalDrain;
    this._alertDrain;
    this._emergencyDrain;
    
    this.debug      = this._publish("debug");
    this.info       = this._publish("info");
    this.notice     = this._publish("notice");
    this.warning    = this._publish("warning");
    this.error      = this._publish("error");
    this.critical   = this._publish("critical");
    this.alert      = this._publish("alert");
    this.emergency  = this._publish("emergency");
}



/*******************************************************************************
 * @description:
 * 
 * @param {Mixed} info:
 * 
 * @TODO info deberia poder ser solo Object o String 
 * @TODO event deberia ser Number
 */
Streamer.prototype._sanitize = function(info){
    info = info || {};
    if (_.isString(info)) { info = {str: info} }        //estandarizacion de String a Object
};



/*******************************************************************************
 * @description
 * 
 * @param {String} level: identificador textual del nivel de logueo deseado
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
 * @param {String} level: identificador textual del nivel de logueo deseado
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
 * 
 * @param {} gate:
 * @param {Mixed} info:
 */
Streamer.prototype._log = function(gate, info){
    if (info && info.slug) gate(info.slug);
    if (info && info.error) {
        gate("====================STACK BEGINS===================");
        gate(info.error.stack);
        gate("====================STACK ENDS===================");
    }
};



/*******************************************************************************
 * @description
 * Dado un nivel de registro, genera una funcion que, valiendose de metodos 
 * auxiliares de la clase, realiza el logueo de la informacion en el destino 
 * oportuno
 */
Streamer.prototype._publish = function(level){
    const self = this;
    return function(event, info){
        self._sanitize(info);
        
        const CODE = self._composeCode(level, event);
        const MESSAGE = self._composeMessage(level, event, info);
        const SLUG = "[" + CODE + "] [" + MESSAGE + "]";
        
        info.severity   = level;
        info.case       = event;
        info.isbn       = self._isbn;
        info.code       = CODE;
        info.slug       = SLUG;
        if (info.req) info.req = self._siftRequest(info.req);
        
        self._log(self["_"+level+"Drain"], info);
    };
};



module.exports = Streamer;