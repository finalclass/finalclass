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
                    var eventBus = new EventEmitter();


                    this.providers = [];

                    this.provide(function () {
                        this.addObject('eventBus', eventBus);
                    });

                    eventBus.on('emit', this.onEventBusEmit);
                }
            }
        },
        onEventBusEmit: {
            method: true,
            value: function (event) {
                var i,
                    dispatchEventOnObject = this.dispatchEventOnObject,
                    providers = this.providers,
                    provider;

                for (i = 0; i < providers.length; i += 1) {
                    provider = providers[i];
                    Object.keys(provider.objects).forEach(function (key) {
                        var obj = provider.objects[key];
                        dispatchEventOnObject(event.event, obj);
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
        dispatchEventOnObject: {
            value: function (event, obj) {
                var type = typeof event === 'string' ? event : event.type;

                if (obj instanceof Object && obj.descriptor !== undefined) {
                    obj.descriptor.dispatch(type, obj, event);
                }
            }
        },
        dispatchInitOnObject: {
            value: function (obj) {
                this.dispatchEventOnObject('init', obj);
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