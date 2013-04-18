/*jslint node:true,browser:true*/
/*global FinalClass, jQuery*/
'use strict';

var fc_descriptor_EventBusFeature = module.exports = function (FinalClass) {
    this.fc = FinalClass;
};

fc_descriptor_EventBusFeature.prototype = Object.create(null, {

    descriptorFeatureName: {
        value: 'eventBus'
    },

    beforeDescribing: {
        value: function (object, property, descriptor, pureDescriptor) {
            var injectValue = descriptor.dirtyDescriptor[property].eventBus;

            if (!injectValue) {
                return pureDescriptor;
            }

            pureDescriptor.get = function () {
                return this.finalApp.get('eventBus');
            };

            delete pureDescriptor.value;
            delete pureDescriptor.set;
            delete pureDescriptor.writable;

            return pureDescriptor;
        }
    },
    beforeConstructor: {
        value: function (object, property, descriptorFeatureValue) {

        }
    }
});
