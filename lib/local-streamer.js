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
    debug:      (info)=>logAll(console.log, info),
    info:       (info)=>logAll(console.log, info),
    notice:     (info)=>logAll(console.warning, info),
    warning:    (info)=>logAll(console.warning, info),
    error:      (info)=>logAll(console.error, info),
    critical:   (info)=>logAll(console.error, info),
    alert:      (info)=>logAll(console.error, info),
    emergency:  (info)=>logAll(console.error, info),
};



/////// MODULE EXPORTS 
module.exports = exports = LocalStreamer;



function logSlug(gate, info){
    if (info && info.slug) return gate(slug);
}



function logError(gate, info){
    if (info && info.error) {
        gate.log("====================STACK BEGINS===================");
        gate.log(info.error.stack);
        gate.log("====================STACK ENDS===================");
    }
}



function logAll(gate, info){
    logSlug(gate, info);
    logError(gate, info);
}