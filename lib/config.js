var ai          = require("./ai")
,   le          = require("./le")
;



module.exports = function(){
    process.env = process.env || {};
    strategy = (process.env.LOGENTRIES_TOKEN)?
        "Logentries" : (process.env.APPLICATIONINSIGHTS_INSTRUMENTATIONKEY)?
            "ApplicationInsights": null;
    
    switch(strategy){
        case "ApplicationInsights": 
            return ai(); 
        case "Logentries":
            return le();
        default:
            return new Error();
    }
};