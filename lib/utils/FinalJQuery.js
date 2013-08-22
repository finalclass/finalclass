/*jslint node:true,browser:true*/
/*global FinalClass, jQuery*/
'use strict';
var FinalClass = FinalClass || require('../FinalClass.js');

var fc_utils_FinalJQuery = module.exports = new FinalClass({
    className: 'fc_utils_FinalJQuery',
    value: this.hasOwnProperty('jQuery') ? jQuery : require('jquery')
});