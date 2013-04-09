/*jslint node:true, browser:true*/
/*global FinalClass*/
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
}