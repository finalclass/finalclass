/*jslint node:true, browser:true*/

'use strict';

var FinalClass = FinalClass || require('./FinalClass.js');

var Provider = module.exports = new FinalClass({
    className: 'fc_Provider',
    parents: [],
    descriptor: {
        objects: {
            on: {
                beforeConstructor: function () {
                    this.objects = {};
                }
            }
        },
        classes: {
            on: {
                beforeConstructor: function () {
                    this.classes = {};
                }
            }
        },
        addObject: {
            value: function (name, bean) {
                this.objects[name] = bean;
            }
        },
        getObject: {
            value: function (name) {
                return this.objects[name];
            }
        },
        addClass: {
            value: function (name, fun) {
                this.classes[name] = fun;
            }
        },
        getClass: {
            value: function (name) {
                return this.classes[name];
            }
        }
    }
});