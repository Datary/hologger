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
 * @param {Nomber} isil: identificador numerico de la libreria de codigos empleada
 */
function Streamer(library, isil){
    this._name = "Streamer";
    this._description = "Streamer constructor";
    this._library = library;
    this._isil = isil;
    
    this._debugDrain;
    this._infoDrain;
    this._noticeDrain;
    this._warningDrain;
    this._errorDrain;
    this._criticalDrain;
    this._alertDrain;
    this._emergencyDrain;
}



/*******************************************************************************
 * @description:
 * Modifica, en su caso, los parametros de entrada de manera que a su conclusion
 * info se halle siempre convertido (estandarizado) en un Object que recoge en 
 * forma de propiedades la info original presentada a saneamiento. 
 * Ademas de esta estandarizacion del tipo de primitiva, se produce una estandarizacion
 * secundaria en el nombre de un numero contado de propiedades, siendo estas:
 * + error => err
 * + request => req 
 *
 * Para info de tipo atomico (Boolean, String, Number) se almacena la informacion 
 * original en la propiedad `str`. 
 * Si la info es un Error, se almacena en la propiedad `err`.  
 * 
 * @param {Number} isbn: identificador numerico del evento que se desea 
 * registrar
 * @param {Mixed} info:
 * 
 */
Streamer.prototype._sanitize = function(isbn, info){
    /////// ARGUMENTS
    //logger()
    if (!isbn && !info) {
        isbn = null;
        info = {};
    
    } else if (!info) {
        //logger(3)
        if (_.isNumber(isbn)){
            info = {};
            isbn = isbn;
        //logger("some custom message")
        //logger({foo: "bar"})
        //logger(Error)
        } else {
            info = _.clone(isbn);
            isbn = null;
        }
    //logger(3, {foo: "bar"})
    } else {}
    
    /////// INFO
    if (_.isString(info)) info = {str: info};
    else if (_.isNumber(info)) info = {str: info.toString()};
    else if (_.isBoolean(info)) info = {str: info.toString()};
    else if (_.isError(info)) info = {err: info};
    else if (_.isPlainObject(info)) info = info;
    else info = {};

    /////// RENOMBRAMIENTO
    if (info.error) {
        info.err = _.clone(info.error);
        delete info.error;
    }
    if (info.request) {
        info.req = _.clone(info.request);
        delete info.request;
    }
};



/*******************************************************************************
 * @description
 * 
 * @param {String} severity: identificador textual del nivel de logueo deseado
 * @param {Number} isbn: identificador numerico del evento que se desea 
 * registrar
 * 
 * @return 
 */
Streamer.prototype._composeCode = function(severity, isbn){
    var SEVERITY_CODE;
    switch (severity) {
        case 'debug': SEVERITY_CODE = 1*10000000; break;
        case 'info': SEVERITY_CODE = 2*10000000; break;
        case 'notice': SEVERITY_CODE = 3*10000000; break;
        case 'warning': SEVERITY_CODE = 4*10000000; break;
        case 'error': SEVERITY_CODE = 5*10000000; break;
        case 'critical': SEVERITY_CODE = 6*10000000; break;
        case 'alert': SEVERITY_CODE = 7*10000000; break;
        case 'emergency': SEVERITY_CODE = 8*10000000; break;
        default: break;
    }
    const LIBRARY_CODE  = (_.isNumber(this._isil))? this._isil*10000 : null;
    const EVENT_CODE    = (_.isNumber(isbn))? isbn : null;
    const FULL_CODE     = (!LIBRARY_CODE || !EVENT_CODE)? 
                                "UNCOMPOSABLE CODE"
                                : SEVERITY_CODE + LIBRARY_CODE + EVENT_CODE;
    return FULL_CODE;
};



/*******************************************************************************
 * @description
 * 
 * @param {String} severity: identificador textual del nivel de logueo deseado
 * @param {Number} isbn: identificador numerico del evento que se desea 
 * registrar
 * @param {Mixed} info:
 * 
 * @return 
 */
Streamer.prototype._composeMessage = function(severity, isbn, info){
    var MESSAGE;
    try {
        MESSAGE = handlebars.compile(this._library[severity][isbn])(info);
    } catch (e) {
        //logger(Error)
        if (info.err) MESSAGE = info.err.toString();
        //logger("Some message")
        else if (info.str) MESSAGE = info.str;
        else MESSAGE = "=========UNMATCHED CODE: " + severity + "/" + isbn + "==========";
    }
    return MESSAGE;
};



/*******************************************************************************
 * @description
 * 
 * @param {Object} req: 
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
        if (req.connection._peername) REQUEST.connection._peername = req.connection._peername;
        if (req.connection.ip) REQUEST.ip = req.connection.ip;
    }
    
    /////// Body 
    //@important puede petarme en peticiones grandes
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
 * @param {Function} gate: Canal a traves del cual se producira el volcado de datos. 
 * Debe tratarse por ello de un metodo encargado de la escritura de datos; es  
 * decir, que dada una informacion, produzca su registro en algun soporte. Vgr,
 * el metodo `log` de la API `console` (`console.log`), 
 * Required.
 * @param {Mixed} info:
 */
Streamer.prototype._log = function(gate, info){
    if (info && info.slug) gate(info.slug);
    if (info && info.err) {
        gate("====================ERR STACK BEGINS===================");
        gate(info.err.stack);
        gate("====================ERR STACK ENDS===================");
    }
};



/*******************************************************************************
 * @description
 * 
 * @param {Number} isbn:
 * @param {} info:
 */
Streamer.prototype.debug = function(isbn, info){
    this._sanitize(isbn, info);
    
    const CODE = this._composeCode("debug", isbn);
    const MESSAGE = this._composeMessage("debug", isbn, info);
    const SLUG = "[" + CODE + "] [" + MESSAGE + "]";
    
    info.severity   = "debug";
    info.isbn       = isbn;
    info.isil       = this._isil;
    info.code       = CODE;
    info.message    = MESSAGE;
    info.slug       = SLUG;
    if (info.req) info.req = this._siftRequest(info.req);
    
    this._log(this._debugDrain, info);
};



/*******************************************************************************
 * @description
 * 
 */
Streamer.prototype.info = function(isbn, info){
    this._sanitize(isbn, info);
    
    const CODE = this._composeCode("info", isbn);
    const MESSAGE = this._composeMessage("info", isbn, info);
    const SLUG = "[" + CODE + "] [" + MESSAGE + "]";
    
    info.severity   = "info";
    info.isbn       = isbn;
    info.isil       = this._isil;
    info.code       = CODE;
    info.message    = MESSAGE;
    info.slug       = SLUG;
    if (info.req) info.req = this._siftRequest(info.req);
    
    this._log(this._infoDrain, info);
};



/*******************************************************************************
 * @description
 * 
 */
Streamer.prototype.notice = function(isbn, info){
    this._sanitize(isbn, info);
    
    const CODE = this._composeCode("notice", isbn);
    const MESSAGE = this._composeMessage("notice", isbn, info);
    const SLUG = "[" + CODE + "] [" + MESSAGE + "]";
    
    info.severity   = "notice";
    info.isbn       = isbn;
    info.isil       = this._isil;
    info.code       = CODE;
    info.message    = MESSAGE;
    info.slug       = SLUG;
    if (info.req) info.req = this._siftRequest(info.req);
    
    this._log(this._noticeDrain, info);
};



/*******************************************************************************
 * @description
 * 
 */
Streamer.prototype.warning = function(isbn, info){
    this._sanitize(isbn, info);
    
    const CODE = this._composeCode("warning", isbn);
    const MESSAGE = this._composeMessage("warning", isbn, info);
    const SLUG = "[" + CODE + "] [" + MESSAGE + "]";
    
    info.severity   = "warning";
    info.isbn       = isbn;
    info.isil       = this._isil;
    info.code       = CODE;
    info.message    = MESSAGE;
    info.slug       = SLUG;
    if (info.req) info.req = this._siftRequest(info.req);
    
    this._log(this._warningDrain, info);
};



/*******************************************************************************
 * @description
 * 
 */
Streamer.prototype.error = function(isbn, info){
    this._sanitize(isbn, info);
    
    const CODE = this._composeCode("error", isbn);
    const MESSAGE = this._composeMessage("error", isbn, info);
    const SLUG = "[" + CODE + "] [" + MESSAGE + "]";
    
    info.severity   = "error";
    info.isbn       = isbn;
    info.isil       = this._isil;
    info.code       = CODE;
    info.message    = MESSAGE;
    info.slug       = SLUG;
    if (info.req) info.req = this._siftRequest(info.req);
    
    this._log(this._errorDrain, info);
};



/*******************************************************************************
 * @description
 * 
 */
Streamer.prototype.critical = function(isbn, info){
    this._sanitize(isbn, info);
    
    const CODE = this._composeCode("critical", isbn);
    const MESSAGE = this._composeMessage("critical", isbn, info);
    const SLUG = "[" + CODE + "] [" + MESSAGE + "]";
    
    info.severity   = "critical";
    info.isbn       = isbn;
    info.isil       = this._isil;
    info.code       = CODE;
    info.message    = MESSAGE;
    info.slug       = SLUG;
    if (info.req) info.req = this._siftRequest(info.req);
    
    this._log(this._criticalDrain, info);
};



/*******************************************************************************
 * @description
 * 
 */
Streamer.prototype.alert = function(isbn, info){
    this._sanitize(isbn, info);
    
    const CODE = this._composeCode("alert", isbn);
    const MESSAGE = this._composeMessage("alert", isbn, info);
    const SLUG = "[" + CODE + "] [" + MESSAGE + "]";
    
    info.severity   = "alert";
    info.isbn       = isbn;
    info.isil       = this._isil;
    info.code       = CODE;
    info.message    = MESSAGE;
    info.slug       = SLUG;
    if (info.req) info.req = this._siftRequest(info.req);
    
    this._log(this._alertDrain, info);
};



/*******************************************************************************
 * @description
 * 
 */
Streamer.prototype.emergency = function(isbn, info){
    this._sanitize(isbn, info);
    
    const CODE = this._composeCode("emergency", isbn);
    const MESSAGE = this._composeMessage("emergency", isbn, info);
    const SLUG = "[" + CODE + "] [" + MESSAGE + "]";
    
    info.severity   = "emergency";
    info.isbn       = isbn;
    info.isil       = this._isil;
    info.code       = CODE;
    info.message    = MESSAGE;
    info.slug       = SLUG;
    if (info.req) info.req = this._siftRequest(info.req);
    
    this._log(this._emergencyDrain, info);
};



/*******************************************************************************
 * @DEPRECATED
 * @description
 * Dado un nivel de registro `level`, genera una funcion que, valiendose de metodos 
 * auxiliares de la clase, realiza el logueo de la informacion en el destino 
 * oportuno. 
 * Aunque actualmente no se usa, permitiria simplificar el codigo, eliminando los 
 * 8 metodos `_logTo***` al reducirlos a una sola funcion configuradora/wrapper, 
 * aunque a costa de cierta ilegibilidad en el mismo.
 */
Streamer.prototype._publish = function(level){
    const self = this;
    return function(isbn, info){
        self._sanitize(info);
        
        const CODE = self._composeCode(level, isbn);
        const MESSAGE = self._composeMessage(level, isbn, info);
        const SLUG = "[" + CODE + "] [" + MESSAGE + "]";
        
        info.severity   = level;
        info.isbn       = isbn;
        info.isil       = self._isil;
        info.code       = CODE;
        info.message    = MESSAGE;
        info.slug       = SLUG;
        if (info.req) info.req = self._siftRequest(info.req);
        
        self._log(self["_"+level+"Drain"], info);
    };
};



/////// MODULE EXPORTS
module.exports = Streamer;