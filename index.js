/**
 * @description
 * Debido al analisis en cascada de las variables de entorno, la existencia 
 * de una pretiere la otra. 
 *
 * 
 * @param {Object} library: 
 * @param {Number} isil: identificador numerico de la libreria de codigos 
 * empleada
 */
var Logger 	= require("./lib/logger")
;


module.exports = function(library, isil){
    //@TODO sanity checks
    isil = isil || null;
    library = library || {};
    process.env = process.env || {};
    var strategy = (process.env.LOGENTRIES_TOKEN)?
        "Logentries" : (process.env.APPINSIGHTS_INSTRUMENTATIONKEY)?
            "ApplicationInsights": "Local";
    
    return new Logger(strategy, library, isil);
};