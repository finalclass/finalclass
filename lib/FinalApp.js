/*jslint browser:true, node:true*/
/*global FinalObject */
'use strict';

var FinalClass = FinalClass || require('./FinalClass.js'),
    Provider = FinalClass.db('fc_Provider'),
    EventEmitter = FinalClass.db('fc_EventEmitter');

var FinalApp = module.exports = new FinalClass({
    className: 'fc_FinalApp',
    parents: [EventEmitter],
    descriptor: {
        providers: {
            on: {
                beforeConstructor: function () {
                    this.providers = [];
                    this.provide(function () {
                        this.addObject('eventBus', new EventEmitter());
                    });
                }
            }
        },
        provide: {
            value: function (configFunction) {
                var o, obj, provider = new Provider();
                configFunction.call(provider);
                this.providers.push(provider);

                //set app
                for (o in provider.objects) {
                    obj = provider.objects[o];
                    if (provider.objects.hasOwnProperty(o)) {
                        this.setAppOnObject(obj);
                        if (obj instanceof Object && obj.descriptor !== undefined) {
                            obj.descriptor.invokeFeatures(obj, FinalClass.features, 'afterSetApp');
                        }
                    }
                }

                //dispatch init
                for (o in provider.objects) {
                    if (provider.objects.hasOwnProperty(o)) {
                        this.dispatchInitOnObject(provider.objects[o]);
                    }
                }

                return this;
            }
        },
        setAppOnObject: {
            value: function (obj) {
                var self = this;

                if (obj instanceof Object) {
                    Object.defineProperty(obj, 'finalApp', {
                        get: function () {
                            return self;
                        }
                    });
                }
                return this;
            }
        },
        dispatchInitOnObject: {
            value: function (obj) {
                if (obj instanceof Object && obj.descriptor !== undefined) {
                    obj.descriptor.dispatch('init', obj);
                }
            }
        },
        get: {
            value: function (name) {
                var p, provider, Klass, obj;

                for (p = 0; p < this.providers.length; p += 1) {
                    provider = this.providers[p];
                    obj = provider.getObject(name);

                    if (obj) {
                        return obj;
                    }

                    Klass = provider.getClass(name);

                    if (Klass) {
                        obj = new Klass();
                        this.setAppOnObject(obj);
                        this.dispatchInitOnObject(obj);
                        return obj;
                    }

                }

                return undefined;
            }
        }
    }
});