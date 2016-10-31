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
 * @api private
 * @inherits Streamer
 */
function RemoteStreamer(library, isbn){
    Streamer.call(this, library, isbn);
    
    this._name = "AppinsightsStreamer";
    this._description = "AppinsightsStreamer constructor";
    
    AppInsights.setup(INSTRUMENTATIONKEY).start();
    //configuro el client con ciertas propiedades personalizadas
    for (var envar in process.env) {
        //cualquier envar de la forma APPINSIGHTS_*
        if ( envar.split("_")[0]==="APPINSIGHTS" && envar!=="APPINSIGHTS_INSTRUMENTATIONKEY") {
            //me quedo con la parte tras APPINSIGHTS_
            const attribute = envar.split("_").slice(1).join("_");
            AppInsights.client.commonProperties[attribute] = process.env.envar;
        }
    }
    
    AppInsights.client;
}



/////// INHERITS FROM STREAMER 
RemoteStreamer.prototype = Object.create(Streamer.prototype);
RemoteStreamer.prototype.constructor = Streamer;



/////// MODULE EXPORTS 
module.exports = exports = RemoteStreamer;