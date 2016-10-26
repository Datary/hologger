/*******************************************************************************
 * @description
 * 
 * appInsights.client.trackEvent("ServerStarted", {dy: {id: "somerandomnumber"}});
 * appInsights.client.trackDependency("CustomDependency", "TriggeringCommand", 2700, true);
 * appInsights.client.trackMetric("StartupTime", 3400);
 * appInsights.client.trackTrace("Successfully tracing", "info", {dy: {id: "somerandomnumber"}});
 * appInsights.client.trackException(new RangeError("RangeErrorTest"));
 * 
 */
var AppInsights     = require('applicationinsights')
;



module.exports = function(){
    process.env = process.env || {};
    const INSTRUMENTATIONKEY = process.env.APPINSIGHTS_INSTRUMENTATIONKEY;
    
    
    
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
    
    return AppInsights.client;
};