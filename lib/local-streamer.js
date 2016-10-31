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



/////// CONFIGURA EL PUBLISHER 
LocalStreamer.prototype._publisher = {
    debug:      console.log,
    info:       console.log,
    notice:     console.warning,
    warning:    console.warning,
    error:      console.error,
    critical:   console.error,
    alert:      console.error,
    emergency:  console.error,
};



/////// MODULE EXPORTS 
module.exports = exports = LocalStreamer;



//LEGACY
function transform(){
    //logueo un String (slug) 
    console.log(slug);
    if (info && info.error) { 
        console.log("====================STACK BEGINS===================");
        console.log(info.error.stack);
        console.log("====================STACK ENDS===================");
    }
}