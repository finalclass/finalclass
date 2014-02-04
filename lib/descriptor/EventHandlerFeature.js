/*jslint node:true,browser:true*/
/*global FinalClass, jQuery*/
'use strict';

var fc_descriptor_EventHandlerFeature = module.exports = function (FinalClass) {
  this.fc = FinalClass;
};

fc_descriptor_EventHandlerFeature.prototype = Object.create(null, {
  descriptorFeatureName: {
    value: 'eventHandler'
  },
  beforeDescribing: {
    value: function (proto, property, descriptor, pureDescriptor) {
      delete pureDescriptor.get;
      delete pureDescriptor.set;
      pureDescriptor.writable = true;

      return pureDescriptor;
    }
  },
  beforeConstructor: {
    value: function (object, property, descriptorFeatureValue) {
      object[property] = object[property].bind(object);
    }
  },
  afterSetApp: {
    value: function (object, property, descriptorFeatureValue) {
      console.log('BINDING', descriptorFeatureValue);
      var bus = object.finalApp.get('eventBus');
      var i;

      for (i = 0; i < descriptorFeatureValue.length; i += 1) {

        bus.on(descriptorFeatureValue[i], object[property]);
      }
    }
  }

});
