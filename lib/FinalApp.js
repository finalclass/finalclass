/*jslint browser:true, node:true*/
/*global FinalObject */
'use strict';

var FinalClass = FinalClass || require('./FinalClass.js'),
    Provider = FinalClass.db('fc_Provider');

var FinalApp = module.exports = new FinalClass({
    className: 'fc_FinalApp',
    parents: [FinalClass.db('fc_EventEmitter')],
    descriptor: {
        providers: {
            on: {
                beforeConstructor: function () {
                    this.providers = [];
                }
            }
        },
        provide: {
            value: function (configFunction) {
                var o, provider = new Provider();
                configFunction.call(provider);
                this.providers.push(provider);

                for (o in provider.objects) {
                    if (provider.objects.hasOwnProperty(o)) {
                        this.initObject(provider.objects[o]);
                    }
                }

                return this;
            }
        },
        initObject: {
            value: function (obj) {
                if (obj.descriptor !== undefined) {
                    obj.descriptor.finalApp = this;
                }
                obj.descriptor.dispatch('finalInit', obj);
                return this;
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
                        this.initObject(obj);
                        return obj;
                    }

                }

                return undefined;
            }
        }
    }
});