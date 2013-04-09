/*jslint node:true*/
/*global FinalObject, FinalDisplayObject, FinalPElement, FinalStage, FinalObject, $*/
'use strict';

var ObjectDescriptor = module.exports = function (FinalClass) {
    this.fc = FinalClass;
    this.allowedFieldDescriptors = [
        'writable',
        'enumerable',
        'configurable',
        'value',
        'set',
        'get',
    ];
    this.clearDescriptor = {};
    this.dirtyDescriptor = {};
};

ObjectDescriptor.prototype = Object.create(null, {

    each: {
        value: function (callback, context) {
            var property;
            context = context || this.dirtyDescriptor;

            for (property in this.dirtyDescriptor) {
                if (this.dirtyDescriptor.hasOwnProperty(property)) {
                    callback.call(context, this.dirtyDescriptor[property], property);
                }
            }
        }
    },

    invokeFeatures: {
        value: function (obj, features, method) {
            var fname, feature, property;
            for (fname in features) {
                if (features.hasOwnProperty(fname)) {
                    feature = features[fname];
                    for (property in this.dirtyDescriptor) {
                        if (this.dirtyDescriptor.hasOwnProperty(property)) {
                            if (this.dirtyDescriptor[property][fname]) {
                                feature[method](obj, property, this.dirtyDescriptor[property][fname]);
                            }
                        }
                    }
                }
            }
            
        }
    },

    eachWithTag: {
        value: function (tagName, callback) {
            this.each(function (property, attributeName) {
                if (attributeName === tagName) {
                    callback.call(this, this[property], property);
                }
            });
        }
    },

    get: {
        value: function (propertyName) {
            return this.dirtyDescriptor[propertyName];
        }
    },

    getAll: {
        value: function () {
            return this.dirtyDescriptor;
        }
    },

    dispatch: {
        value: function (what, fobject, data) {
            var property, itemDescriptor;

            for (property in this.dirtyDescriptor) {
                itemDescriptor = this.dirtyDescriptor[property];
                if (itemDescriptor.on && typeof itemDescriptor.on[what] === 'function') {
                    itemDescriptor.on[what].call(fobject, data);
                }
            }
        }
    },

    purifyDescriptor: {
        value: function (object, property, descriptor) {
            var clear = {}, d, propDesc, length = 0, featureName, feature;
            propDesc = descriptor[property];

            for (featureName in propDesc) {
                feature = this.fc.features[featureName];
                if (feature) {
                    feature.beforeDescribing(object, property, this, clear);
                }
            }

            for (featureName in propDesc) {
                if (this.allowedFieldDescriptors.indexOf(featureName) !== -1) {
                    clear[featureName] = propDesc[featureName];
                }
            }

            length = 0;
            for (featureName in clear) {
                if (clear.hasOwnProperty(featureName)) {
                    length += 1;
                }
            }

            if (length === 0) {
                return undefined;
            }

            return clear;
        }
    },

    copyDescriptor: {
        value: function (target, source) {
            var d;

            for (d in source) {
                target[d] = source[d];
            }
        }
    },

    describeProperty: {
        value: function (object, property, descriptor) {
            var purified;
            this.copyDescriptor(this.dirtyDescriptor, descriptor);
            purified = this.purifyDescriptor(object, property, this.dirtyDescriptor);
            if (purified) {
                Object.defineProperty(object, property, purified);
            }
            return purified;
        }
    },

    describe: {
        value: function (object, descriptor) {
            var i;

            this.clearDescriptor = {};

            for (i in descriptor) {
                if (descriptor.hasOwnProperty(i)) {
                    this.clearDescriptor[i] = this.describeProperty(object, i, descriptor);
                }
            }
        }
    }

});