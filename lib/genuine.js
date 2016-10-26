/*******************************************************************************
 * @description
 * 
 */
var siftRequest     = require("./lib/sift-request");



module.exports = function (lib, libraryId){ 
    return {
        "debug": genuineLogger("debug", lib, libraryId),
        "info": genuineLogger("info", lib, libraryId),
        "notice": genuineLogger("notice", lib, libraryId),
        "warning": genuineLogger("warning", lib, libraryId),
        "error": genuineLogger("error", lib, libraryId),
        "critical": genuineLogger("critical", lib, libraryId),
        "alert": genuineLogger("alert", lib, libraryId),
        "emergency": genuineLogger("emergency", lib, libraryId),
    };
};



/*******************************************************************************
 * @description
 * Puesto que en entornos de desarrollo (development) solo se loguea un 
 * mensaje que resume el evento (al contrario que en pre-produccion y en 
 * produccion, donde se almacena como JSON toda la informacion del mismo),
 * en los casos en que el evento contenga un Object de tipo Error, ademas 
 * del slug se loguea explicitamente el stack del Error, pues de otro modo se 
 * pierde la informacion contenida en el mismo, vital para la depuracion 
 * del mismo.
 * 
 * @param {Object} lib:
 * @param {String} level: 
 * @param {Number} libraryId:
 * 
 * @return {Function}:
 */
function genuineLogger(level, lib, libraryId){ 
    libraryId = libraryId || 999;
    return f;
    
    function f(eventCode, info){
        //sanitize and defaults 
        //@TODO info deberia poder ser solo Object o String 
        //@TODO eventCode deberia ser Number
        info = info || {};
        if (_.isString(info)) { info = {str: info} }        //estandarizacion de String a Object
        
        //compongo el codigo de evento
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
        var LIBRARY_CODE = libraryId*10000;
        var FULL_CODE = LEVEL_CODE + LIBRARY_CODE + eventCode;
        
        //Selecciono, esc, informacion pertinente de la request
        if (info && info.request) { info.request = siftRequest(info.request) }
        //genero el cuerpo del mensaje del slug
        var MESSAGE;
        try {
            MESSAGE = handlebars.compile(lib[level][eventCode])(info);
        } catch (e) {
            MESSAGE = "=========EVENT CODE MALFORMED: " + level + "/" + eventCode + "==========";
        }
        
        //compongo el slug
        var SLUG = "[" + FULL_CODE + "] [" + MESSAGE + "]";
        
        //segun el entorno, logueo un String (slug) o un Object (info)
        if (process.env.RACK_ENV === "development"){
            LOGENTRIES_CLIENT[level](SLUG);
            //@vid description
            if (info && info.error) {
                console.log("====================STACK BEGINS===================");
                console.log(info.error.stack);
                console.log("====================STACK ENDS===================");
            } 
        } else {
            info.severity = level;
            info.library = libraryId;
            info.code = eventCode;
            info.fullCode = FULL_CODE;
            info.eventSlug = SLUG;
            //if (info && info.error) info.response = ERROR_CODES[info.error];
            LOGENTRIES_CLIENT[level](info);
        }
    }
}