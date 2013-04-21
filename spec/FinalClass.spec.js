/*global describe, it*/
'use strict';

var FinalClass = require('../lib/FinalClass.js');

describe('FinalClass', function () {

    it('can do simple inheritance', function () {
        var child,
            ChildClass,
            ParentClass = function () {};

        ParentClass.prototype.test = function () {
            this.abc = 8;
        }


        expect(function () {
            ChildClass = new FinalClass({
                className: 'test_Child',
                parents: [ParentClass],
                descriptor: {
                    run: {
                        value: function () {
                            this.test();
                        }
                    }
                }
            });
        }).not.toThrow();

        expect(function () {
            child = new ChildClass();
        }).not.toThrow();

        expect(function () {
            child.run();
        }).not.toThrow();

        expect(child.abc).toBe(8);

        expect(child instanceof ParentClass).toBe(true);

    });

});