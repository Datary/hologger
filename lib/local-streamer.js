/*******************************************************************************
 * @description
 * 
 */
var _               = require('lodash') 
,   chalk           = require('chalk')
,   Streamer        = require("./streamer")
,   selftils        = require("./selftils")
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
}



/////// INHERITS FROM STREAMER 
LocalStreamer.prototype = Object.create(Streamer.prototype);
LocalStreamer.prototype.constructor = Streamer;



/////// MODULE EXPORTS 
module.exports = exports = LocalStreamer;