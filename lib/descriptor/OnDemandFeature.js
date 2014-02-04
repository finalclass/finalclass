/*jslint node:true,browser:true*/
/*global FinalClass, jQuery*/
'use strict';

var fc_descriptor_OnDemandFeature = module.exports = function (FinalClass) {
    this.fc = FinalClass;
};

fc_descriptor_OnDemandFeature.prototype = Object.create(null, {

    descriptorFeatureName: {
        value: 'onDemand'
    },
    beforeDescribing: {
        value: function (object, property, descriptor, pureDescriptor) {
            var initFunction = descriptor.dirtyDescriptor[property].onDemand;

            pureDescriptor.get = function () {
                if (!this['@' + property]) {
                    this['@' + property] = initFunction.call(this);
                }

                return this['@' + property];
            };

            return pureDescriptor;
        }
    }
});
