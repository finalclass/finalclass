/*jslint node:true,browser:true*/
/*global FinalClass, jQuery*/
'use strict';

var fc_descriptor_TagAttributeFeature = module.exports = function (FinalClass) {
    this.fc = FinalClass;
};

fc_descriptor_TagAttributeFeature.prototype = Object.create(null, {

    descriptorFeatureName: {
        value: 'tagAttribute'
    },
    beforeDescribing: {
        value: function (object, property, descriptor, pureDescriptor) {
            var desc = descriptor.dirtyDescriptor[property], customSetter;

            if (desc.tagAttribute) {
                desc.on = desc.on || {};

                customSetter = desc.set;

                if (!customSetter) {
                    customSetter = function (val) {
                        this['@' + property] = val;
                    };
                }

                if (!desc.get) {
                    desc.get = function () {
                        return this['@' + property];
                    };
                }

                desc.set = function (val) {
                    this.dom.attr(property, val);
                    customSetter.call(this, val);
                };

                desc.on.viewChange = function () {
                    this[property] = this['@' + property];
                };
                desc.on.propertyChange = desc.on.viewChange;
            }
        }
    },
    beforeConstructor: {
        value: function (object, property, descriptorFeatureValue) {
            //object[property] = this.fc.beans(descriptorFeatureValue);
        }
    }
});
