/*******************************************************************************
 * @description
 * Clase Logger
 * 
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/connection.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error.js
 * @vid https://github.com/Automattic/mongoose/blob/master/lib/error/validation.js
 */
var util            = require('util')
,   fakeLogger      = require("./lib/fake")
,   genuineLogger   = require("./lib/genuine")
;



/**
 * `Logger` constructor.
 *
 * @api public
 * 
 * @param {String} strategy:
 * @param {Object} library:
 * @param {Number} id:
 */
function Logger(strategy, library, id){
    this.strategy = strategy;
    this.library = {};
    this.id = id;
    
    switch (strategy) {
        case "Local":
            this.debug      = fakeLogger("debug", lib, id);
            this.info       = fakeLogger("info", lib, id);
            this.notice     = fakeLogger("notice", lib, id);
            this.warning    = fakeLogger("warning", lib, id);
            this.error      = fakeLogger("error", lib, id);
            this.critical   = fakeLogger("critical", lib, id);
            this.alert      = fakeLogger("alert", lib, id);
            this.emergency  = fakeLogger("emergency", lib, id);
            break;
        
        case "Logentries":
            this.debug      = genuineLogger("debug", lib, id);
            this.info       = genuineLogger("info", lib, id);
            this.notice     = genuineLogger("notice", lib, id);
            this.warning    = genuineLogger("warning", lib, id);
            this.error      = genuineLogger("error", lib, id);
            this.critical   = genuineLogger("critical", lib, id);
            this.alert      = genuineLogger("alert", lib, id);
            this.emergency  = genuineLogger("emergency", lib, id);
            break;
        default:
            return;
    }
}



Logger.prototype.foo = "bar";



module.exports = Logger;