/*******************************************************************************
 * @description
 * 
 */
var _               = require('lodash') 
,   chalk           = require('chalk')
,   Streamer        = require("./streamer")
;



/*******************************************************************************
 * @description
 * LocalStreamer constructor
 * 
 * @api private
 * @inherits Streamer
 */
function LocalStreamer(library, isbn){
    Streamer.call(this, library, isbn);
    
    this._name = "LocalStreamer";
    this._description = "LocalStreamer constructor";
    
    this._debugDrain = console.log;
    this._infoDrain = console.log;
    this._noticeDrain = console.warn;
    this._warningDrain = console.warn;
    this._errorDrain = console.error;
    this._criticalDrain = console.error;
    this._alertDrain = console.error;
    this._emergencyDrain = console.error;
}



/////// INHERITS FROM STREAMER 
LocalStreamer.prototype = Object.create(Streamer.prototype);
LocalStreamer.prototype.constructor = Streamer;



/////// MODULE EXPORTS 
module.exports = exports = LocalStreamer;