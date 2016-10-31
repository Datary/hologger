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
var _               = require('lodash') 
,   chalk           = require('chalk')
;



/*******************************************************************************
 * @description
 * RemoteStreamer constructor
 * 
 * @api private
 * @inherits Streamer
 */
function RemoteStreamer(library, isbn){
    Streamer.call(this, library, isbn);
    
    this._name = "LogentriesStreamer";
    this._description = "LogentriesStreamer constructor";
}



/////// INHERITS FROM STREAMER 
RemoteStreamer.prototype = Object.create(Streamer.prototype);
RemoteStreamer.prototype.constructor = Streamer;



/////// CONFIGURA EL PUBLISHER 
RemoteStreamer.prototype._publisher = {
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
module.exports = exports = RemoteStreamer;



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