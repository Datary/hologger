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
 * @param {String} level: 
 * 
 * @return {Function}:
 */
var chalk           = require('chalk')
,   selftils        = require("./selftils")
,   config          = require("./config")
;



module.exports = function(level){ 
    //@TODO sanity checks and defaults
    library = this.library;
    isbn = this.isbn;
    
    return function(event, info){
        //sanitize and defaults 
        //@TODO info deberia poder ser solo Object o String 
        //@TODO event deberia ser Number
        info = info || {};
        if (_.isString(info)) { info = {str: info} }        //estandarizacion de String a Object
        
        //Genero el cliente
        var CLIENT = config();
        
        //compongo el codigo de evento
        const FULL_CODE = selftils.composeCode(level, event, isbn);
        
        //Selecciono, esc, informacion pertinente de la request
        if (info && info.request) info.request = selftils.siftRequest(info.request);
        
        //genero el cuerpo del mensaje del slug
        const MESSAGE = selftils.composeMessage(library, level, event, info);
        
        //compongo el slug
        var SLUG = "[" + FULL_CODE + "] [" + MESSAGE + "]";
        
        //segun el entorno, logueo un String (slug) o un Object (info)
        if (process.env.RACK_ENV === "development"){
            CLIENT[level](SLUG);
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
            info.eventSlug  = SLUG;
            //if (info && info.error) info.response = ERROR_CODES[info.error];
            CLIENT[level](info);
        }
    };
};