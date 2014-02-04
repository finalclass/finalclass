/*jslint node:true,browser:true*/
/*global FinalClass, jQuery*/
'use strict';

var fc_descriptor_InjectFeature = module.exports = function (FinalClass) {
    this.fc = FinalClass;
};

fc_descriptor_InjectFeature.prototype = Object.create(null, {

    descriptorFeatureName: {
        value: 'inject'
    },

    beforeDescribing: {
        value: function (object, property, descriptor, pureDescriptor) {
            var injectValue = descriptor.dirtyDescriptor[property].inject;

            pureDescriptor.get = function () {
                return this.finalApp.get(injectValue);
            };

            delete pureDescriptor.value;
            delete pureDescriptor.set;
            delete pureDescriptor.writable;

            return pureDescriptor;
        }
    },
    beforeConstructor: {
        value: function (object, property, descriptorFeatureValue) {
            //object[property] = this.fc.beans(descriptorFeatureValue);
        }
    }
});
