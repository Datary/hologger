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
    
    this._name = "RemoteStreamer";
    this._description = "RemoteStreamer constructor";
}



/////// INHERITS FROM STREAMER 
RemoteStreamer.prototype = Object.create(Streamer.prototype);
RemoteStreamer.prototype.constructor = Streamer;



/////// MODULE EXPORTS 
module.exports = exports = RemoteStreamer;