/*******************************************************************************
 * @description
 * Libreria de funciones empleadas de manera recurrente en el codigo 
 * 
 */
var utils   = require('utils')
,   _       = require('lodash')
;


/*******************************************************************************
 * @description
 * 
 * @param {String} level:
 * @param {Number} event: identificador numerico del evento que se desea 
 * registrar
 * @param {Nomber} library: identificador numerico que identifica la libreria 
 * de codigos empleada
 * 
 * @return 
 */
exports.composeCode = function(level, event, library){
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
    const LIBRARY_CODE  = libraryId*10000;
    const EVENT_CODE    = event;
    const FULL_CODE     = LEVEL_CODE + LIBRARY_CODE + EVENT_CODE;
    
    return FULL_CODE;
};



/*******************************************************************************
 * @description
 * 
 */
exports.siftRequest = function(req){
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