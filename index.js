/***************************************************************************
 * @description
 * Debido al analisis en cascada de las variables de entorno, la existencia 
 * de una pretiere la otra. 
 * 
 * @param {Object} library: 
 * @param {Number} isbn: identificador numerico de la libreria
 ***************************************************************************/
var Logger          = require("./lib/logger")
;


module.exports = function(library, isbn){
    //@TODO sanity checks
    isbn = isbn || 666;
    library = library || {};
    process.env = process.env || {};
    strategy = (process.env.LOGENTRIES_TOKEN)?
        "Logentries" : (process.env.APPLICATIONINSIGHTS_INSTRUMENTATIONKEY)?
            "ApplicationInsights": "Local";
    
    return new Logger(strategy, library, isbn);
};