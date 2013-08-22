/*jslint node:true*/
/*global describe, it, expect*/

'use strict';

describe('FinalEmitter', function () {
    var FinalClass = require('../lib/FinalClass.js');

    var EmiterTest = new FinalClass({
            className: 'EmiterTest',
            parents: [FinalClass.db('fc_EventEmitter')],
            descriptor: {
                EmiterTest: {
                    value: function () {
                        this.EventEmitter();
                        //emit in constructor
                        this.emit({type: 'abc'});
                    }
                },
                prop: {
                    on: {
                        beforeConstructor: function (event) {
                            this.prop = 0;
                        },
                        abc: function (event) {
                            this.prop += 1;
                        }
                    }
                }
            }
        });

    it('dispatches', function () {
        var emiter = new EmiterTest();
        emiter.emit({type: 'abc'});

        expect(emiter.prop).toBe(2);

        emiter.emit({type: 'abc'});
        emiter.emit({type: 'abc'});
        
        expect(emiter.prop).toBe(4);
    });

});
