/*******************************************************************************
 * @description
 * Clase `Streamer`
 * 
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/connection.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error/validation.js
 */
var util                = require('util')
,   chalk               = require('chalk')
,   selftils            = require("./selftils")
;



/**
 * `Streamer` constructor.
 *
 * @api public
 * 
 */
function Streamer(strategy, library, isbn){
    this.description = "Streamer constructor";
    this.debug;
    this.info;
    this.notice;
    this.warning;
    this.error;
    this.critical;
    this.alert;
    this.emergency;
}



/**
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



/**
 * @description
 * 
 */
Streamer.prototype._compose = function(){
    //compongo el codigo de evento
    const FULL_CODE = selftils.composeCode(level, event, isbn);
    //genero el cuerpo del mensaje del slug
    const MESSAGE = selftils.composeMessage(library, level, event, info);
    //compongo el slug
    var SLUG = "[" + FULL_CODE + "] [" + MESSAGE + "]";
};



Streamer.prototype._send = function(){
    
};



module.exports = Streamer;