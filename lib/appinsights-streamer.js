/*******************************************************************************
 * @description
 * De modo general, la API de Azure Application Insights admite los siguientes 
 * cuatro formatos de invocacion: 
 * + appInsights.client.trackEvent("ServerStarted", {foo: "bar"});
 * + appInsights.client.trackDependency("CustomDependency", "TriggeringCommand", 2700, true);
 * + appInsights.client.trackMetric("StartupTime", 3400);
 * + appInsights.client.trackTrace("Successfully tracing", "info", {foo: "bar"}});
 * + appInsights.client.trackException(new RangeError("RangeErrorTest"));
 * 
 */
var _               = require('lodash') 
,   chalk           = require('chalk')
,   AppInsights     = require('applicationinsights')
,   Streamer        = require("./streamer")
;



/*******************************************************************************
 * @description
 * AppinsightsStreamer constructor
 * 
 * Durante la configuracion del cliente, se define tantas propiedades globales
 * del mismo como variables de entorno existan de la forma APPINSIGHTS_* (por 
 * ejemplo APPINSIGHTS_INSTRUMENTATIONKEY), nombrandolas con la substring que 
 * sigue a APPINSIGHTS_ (aqui, INSTRUMENTATIONKEY)
 * 
 * @api private
 * @inherits Streamer
 */
function AppinsightsStreamer(library, isbn){
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
            AppInsights.client.commonProperties[attribute] = process.env[envar];
        }
    }
    
    this._debugDrain = AppInsights.client.trackTrace.bind(AppInsights.client);
    this._infoDrain = AppInsights.client.trackTrace.bind(AppInsights.client);
    this._noticeDrain = AppInsights.client.trackTrace.bind(AppInsights.client);
    this._warningDrain = AppInsights.client.trackTrace.bind(AppInsights.client);
    this._errorDrain = AppInsights.client.trackTrace.bind(AppInsights.client);
    this._criticalDrain = AppInsights.client.trackTrace.bind(AppInsights.client);
    this._alertDrain = AppInsights.client.trackTrace.bind(AppInsights.client);
    this._emergencyDrain = AppInsights.client.trackTrace.bind(AppInsights.client);
    
    //AppInsights.client.trackTrace("Successfully tracing", "info", {foo: "bar"});
    //AppInsights.client.trackException(new RangeError("RangeErrorTest"));
}



/////// INHERITS FROM STREAMER 
AppinsightsStreamer.prototype = Object.create(Streamer.prototype);
AppinsightsStreamer.prototype.constructor = Streamer;



/******************************************************************************
 * @description 
 * 
 * @param {Object} obj:
 * @param {Boolean} deep: 
 * @param {String} separator: 
 * 
 * @example
 * ```
 * Dado el siguiente filetree,
 *  {
 *      fileA: 6fa78bc
 *      dir1: {
 *          file1A:bcd765a
 *          dir11: {
 *              file11A: ff6cd89
 *          },
 *      },
 *      fileB:2f21caf
 * }
 * lo transforma en 
 *  { 
 *      fileA: 6fa78bc
 *      dir1/file1A: bcd765a
 *      dir1/dir11: { 
 *          file11A: ff6cd89
 *      }, 
 *      fileB: 2f21caf
 *  }
 *  y finalmente, por sucesivas iteraciones, en: 
 *  { 
 *      fileA: 6fa78bc,  
 *      dir1/file1A: bcd765a,  
 *      dir1/dir11/file11A: ff6cd89  
 *      fileB: 2f21caf,  
 *  }
 * ```
 */
AppinsightsStreamer.prototype._flattenObject = function(obj, deep, separator){
    deep = deep || false;
    separator = separator || "/";
    
    var flattenedObj = {};
    var subObj;
    var subPath;
    for (var prop in obj) {
        if (_.isPlainObject(obj[prop])) {
            subObj = obj[prop];
            for (var subProp in subObj) {
                subPath = prop + separator + subProp;
                flattenedObj[subPath] = obj[prop][subProp];
            }
        } else {
            flattenedObj[prop] = obj[prop];
        }
    }
    
    //Recursion
    if (!deep) { 
        return flattenedObj; 
    } else {
        if (_.some(flattenedObj, (path)=>_.isPlainObject(path))) {
            return this.flattenObject(flattenedObj, true, separator);
        } else {
            return flattenedObj;
        }
    } 
};



/*******************************************************************************
 * @description
 * Sobreescribe el metodo de la clase `Streamer`.
 * Envia la informacion como Object aplanado, ya que Azure Application Insights 
 * no permite el procesamiento de Objects anidados.
 * Ademas, adapta el envio a la particular signatura de Application Insights: 
 * appInsights.client.trackTrace("Successfully tracing", "info", {foo: "bar"});
 * 
 * @param {} gate:
 * @param {Mixed} info:
 */
AppinsightsStreamer.prototype._log = function(gate, info){
    info = this._flattenObject(info, true, "_");
    return gate(info.slug, info.severity, info); 
};


/////// MODULE EXPORTS 
module.exports = exports = AppinsightsStreamer;