/**
 * Module dependencies.
 */
var Logger = require("./lib/logger");


/**
 * Export default singleton.
 *
 * @api public
 */
exports = module.exports = new Logger();


/**
 * Expose constructors.
 */
exports.Hologger =
exports.Logger = Logger;


/**
 * Expose strategies.
 */
exports.strategies = {};