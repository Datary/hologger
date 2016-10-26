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
,   _               = require('lodash')
,   handlebars      = require('handlebars')
,   siftRequest     = require("./sift-request");




module.exports = function(level, lib, libraryId){ 
    //@TODO sanity checks and defaults
    return function f(eventCode, info){
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
        
        //genero el cuerpo del mensaje del slug
        var MESSAGE;
        try {
            MESSAGE = handlebars.compile(lib[level][eventCode])(info);
        } catch (e) {
            MESSAGE = "=========EVENT CODE MALFORMED: " + level + "/" + eventCode + "==========";
        }
        
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