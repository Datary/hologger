/*******************************************************************************
 * @description
 * 
 * 
 */
module.exports = function(req){
    const REQUEST = {};
    
    /////// Basicas
    const SIFTING_PROPS = [
        "_parsedUrl", "_remoteAddress", "baseUrl", "complete", "cookies", "domain", 
        "endpoint", "headers", "httpVersion", "originalUrl", "method",
        "params", "query", "signedCookies", "statusCode", "statusMessage", 
        "url", "user", "authToken", "encodedAuthToken"
    ];
    SIFTING_PROPS.forEach((e)=>{REQUEST[e]=req[e]});
    
    /////// Exoticas (analizar con cuidado)
    if (req.connection) {
        REQUEST.connection = {};
        if (req.connection._peername) { REQUEST.connection._peername = req.connection._peername }
        if (req.connection.ip) { REQUEST.ip = req.connection.ip }
    }
    
    /////// body !!!Ojo, puede petarme logentries en peticiones grandes
    if (req.body) {
        REQUEST.body = req.body;
        _.unset(REQUEST, 'body.slug');
    }
    
    return REQUEST;
};