/*******************************************************************************
 * @description
 * 
 * @param {Object} lib:
 * @param {String} level: 
 * @param {Number} libraryId:
 * 
 * @return {Function}:
 */
var chalk           = require('chalk')
,   selftils        = require("./selftils")
,   siftRequest     = require("./sift-request")
;




module.exports = function(level, lib, libraryId){ 
    //@TODO sanity checks and defaults
    return function(eventCode, info){
        //sanitize and defaults 
        //@TODO info deberia poder ser solo Object o String 
        //@TODO eventCode deberia ser Number
        info = info || {};
        if (_.isString(info)) { info = {str: info} }        //estandarizacion de String a Object
        
        //compongo el codigo de evento
        const FULL_CODE = selftils.composeCode(level, eventCode, libraryId);
        
        //genero el cuerpo del mensaje del slug
        const MESSAGE = selftils.composeMessage(lib, level, eventCode, info);
        
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