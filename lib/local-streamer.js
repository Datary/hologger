/*******************************************************************************
 * @description
 * 
 * @param {String} level: 
 * 
 * @return {Function}:
 */
var chalk           = require('chalk')
,   selftils        = require("./selftils")
;




module.exports = function(level){
    //@TODO sanity checks and defaults
    library = this.library;
    isbn = this.isbn;
    
    return function(event, info){
        //sanitize and defaults 
        //@TODO info deve poder ser solo Object o String 
        //@TODO event debe ser Number
        info = info || {};
        if (_.isString(info)) { info = {str: info} }        //estandarizacion de String a Object
        
        //compongo el codigo de evento
        const FULL_CODE = selftils.composeCode(level, event, isbn);
        //genero el cuerpo del mensaje del slug
        const MESSAGE = selftils.composeMessage(library, level, event, info);
        //compongo el slug
        var SLUG = "[" + FULL_CODE + "] [" + MESSAGE + "]";
        
        //logueo un String (slug) 
        console.log(SLUG);
        if (info && info.error) { 
            console.log("====================STACK BEGINS===================");
            console.log(info.error.stack);
            console.log("====================STACK ENDS===================");
        }
    };
};