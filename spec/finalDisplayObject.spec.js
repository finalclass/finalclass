/*jslint node:true*/
/*global describe, it, expect, jQuery*/

'use strict';

//console.log(requir('../lib/FinalClass.js'));
//process.exit();
var $ = this.hasOwnProperty('jQuery') ? this.jQuery : require('jquery');

describe('FinalDisplayObject', function () {
    var TextInput = require('../lib/display/TextInput.js');

    it('dispatches', function () {
        var input = new TextInput();

        input.text = 'Test';
        expect(input.html.html()).toBe('Test');
    });

});