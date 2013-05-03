/*jslint node:true, browser:true*/
'use strict';

if ('undefined' !== typeof window) {
    window.module = {
        exports: {}
    };
    window.require = function () {
        throw new Error('server side require use attempt');
    };
} else {
    module.exports = require('./lib/FinalClass.js');
    module.exports.EventEmitter = require('./lib/EventEmitter.js');
    module.exports.Provider = require('./lib/Provider.js');
    module.exports.FinalApp = require('./lib/FinalApp.js');
}