/**
 * Module dependencies.
 */
var Hologger = require("./lib/logger");


/**
 * Export default singleton.
 *
 * @api public
 */
exports = module.exports = new Hologger();


/**
 * Expose constructors.
 */
exports.Hologger =
exports.Logger = Hologger;


/**
 * Expose strategies.
 */
exports.strategies = {};