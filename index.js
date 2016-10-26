/***************************************************************************
 * @description
 * 
 * emergency;    // 8xxxxxxx
 * alert;        // 7xxxxxxx
 * critical;     // 6xxxxxxx
 * error;        // 5xxxxxxx
 * warning;      // 4xxxxxxx
 * notice;       // 3xxxxxxx
 * info;         // 2xxxxxxx
 * debug;        // 1xxxxxxx
 ***************************************************************************/
var fakeLogger      = require("./lib/fake")
,   genuineLogger   = require("./lib/genuine")
;



const LOCAL_OUTPUT_ONLY = !process.env.LOGENTRIES_TOKEN && !process.env.APPLICATIONINSIGHTS_INSTRUMENTATIONKEY;
if (LOCAL_OUTPUT_ONLY) {
    module.exports = function(lib, libraryId){
        //@TODO sanity checks
        libraryId = libraryId || 666;
        lib = lib || {};
        
        return {
            "debug": fakeLogger("debug", lib, libraryId),
            "info": fakeLogger("info", lib, libraryId),
            "notice": fakeLogger("notice", lib, libraryId),
            "warning": fakeLogger("warning", lib, libraryId),
            "error": fakeLogger("error", lib, libraryId),
            "critical": fakeLogger("critical", lib, libraryId),
            "alert": fakeLogger("alert", lib, libraryId),
            "emergency": fakeLogger("emergency", lib, libraryId),
        };
    };
} else {
    module.exports = function (lib, libraryId){
        //@TODO sanity checks
        libraryId = libraryId || 666;
        lib = lib || {};
        
        return {
            "debug": genuineLogger("debug", lib, libraryId),
            "info": genuineLogger("info", lib, libraryId),
            "notice": genuineLogger("notice", lib, libraryId),
            "warning": genuineLogger("warning", lib, libraryId),
            "error": genuineLogger("error", lib, libraryId),
            "critical": genuineLogger("critical", lib, libraryId),
            "alert": genuineLogger("alert", lib, libraryId),
            "emergency": genuineLogger("emergency", lib, libraryId),
        };
    };
}