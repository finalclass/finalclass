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

    it('can describe simple objects', function () {
        var obj = {};

        expect(function () {
            FinalClass.describe(obj, {
                test: {
                    value: function () {
                        return 'test';
                    }
                }
            });
        }).not.toThrow();

        expect(obj.test()).toBe('test');
    });

    it('do not overlap', function () {
        var f1,
            f2,
            beforeConstructor = jasmine.createSpy('beforeConstructor'),
            FClass = new FinalClass({
            className: 'FClass',
            parents: [],
            descriptor: {
                howMuch: {
                    on: {
                        beforeConstructor: function () {
                            this.howMuch = 10;
                        }
                    }
                },
                mockTest: {
                    on: {
                        beforeConstructor: beforeConstructor
                    }
                }
            }
        });

        f1 = new FClass();
        f1.howMuch = 5;
        f2 = new FClass();

        expect(f2.howMuch).toBe(10);
        expect(f1.howMuch).toBe(5);

        expect(beforeConstructor.calls.length).toBe(2);
    });

});