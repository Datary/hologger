/*******************************************************************************
 * @description
 * appInsights.client.trackEvent("ServerStarted", {dy: {id: "somerandomnumber"}});
 * appInsights.client.trackDependency("CustomDependency", "TriggeringCommand", 2700, true);
 * appInsights.client.trackMetric("StartupTime", 3400);
 * appInsights.client.trackTrace("Successfully tracing", "info", {dy: {id: "somerandomnumber"}});
 * appInsights.client.trackException(new RangeError("RangeErrorTest"));
 * 
 * @param {String} level: 
 * 
 * @return {Function}:
 */
var _               = require('lodash') 
,   chalk           = require('chalk')
,   AppInsights     = require('applicationinsights')
,   Streamer        = require("./streamer")
;



/*******************************************************************************
 * @description
 * RemoteStreamer constructor
 * 
 * Durante la configuracion del cliente, se define tantas propiedades globales
 * del mismo como variables de entorno existan de la forma APPINSIGHTS_* (por 
 * ejemplo APPINSIGHTS_INSTRUMENTATIONKEY), nombrandolas con la substring que 
 * sigue a APPINSIGHTS_ (aqui, INSTRUMENTATIONKEY)
 * 
 * @api private
 * @inherits Streamer
 */
function RemoteStreamer(library, isbn){
    Streamer.call(this, library, isbn);
    
    this._name = "AppinsightsStreamer";
    this._description = "AppinsightsStreamer constructor";
    
    AppInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
        .setAutoCollectRequests(false)
        .setAutoCollectPerformance(false)
        .setAutoCollectExceptions(false)
        .start();
    
    for (var envar in process.env) {
        if ( envar.split("_")[0]==="APPINSIGHTS" && envar!=="APPINSIGHTS_INSTRUMENTATIONKEY") {
            const attribute = envar.split("_").slice(1).join("_");
            AppInsights.client.commonProperties[attribute] = process.env.envar;
        }
    }
    
    this._debugDrain = AppInsights.client.trackTrace;
    this._infoDrain = AppInsights.client.trackTrace;
    this._noticeDrain = AppInsights.client.trackTrace;
    this._warningDrain = AppInsights.client.trackTrace;
    this._errorDrain = AppInsights.client.trackTrace;
    this._criticalDrain = AppInsights.client.trackTrace;
    this._alertDrain = AppInsights.client.trackTrace;
    this._emergencyDrain = AppInsights.client.trackTrace;
}



/////// INHERITS FROM STREAMER 
RemoteStreamer.prototype = Object.create(Streamer.prototype);
RemoteStreamer.prototype.constructor = Streamer;



/////// MODULE EXPORTS 
module.exports = exports = RemoteStreamer;