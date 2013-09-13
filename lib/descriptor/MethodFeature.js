/*jslint node:true,browser:true*/
/*global FinalClass, jQuery*/
'use strict';

var fc_descriptor_MethodFeature = module.exports = function (FinalClass) {
    this.fc = FinalClass;
};

fc_descriptor_MethodFeature.prototype = Object.create(null, {

    descriptorFeatureName: {
        value: 'method'
    },
    beforeDescribing: {
        value: function (object, property, descriptor, pureDescriptor) {
            var descriptorFeatureValue = descriptor.dirtyDescriptor[property].method;

            if (descriptorFeatureValue != false) {
                pureDescriptor.writable = true;
                if (descriptorFeatureValue instanceof Function) {
                    pureDescriptor.value = descriptorFeatureValue;
                }
            }

            return pureDescriptor;
        }
    },
    beforeConstructor: {
        value: function (object, property, descriptorFeatureValue) {
            if (descriptorFeatureValue === true) {
                object[property] = object[property].bind(object);
            }
        }
    }
});
