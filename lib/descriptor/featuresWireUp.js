/*jslint node:true, browser:true*/
'use strict';

var FinalClass = FinalClass || require('../FinalClass.js');

//Init standard features
var InjectFeature = 'undefined' === typeof fc_descriptor_InjectFeature ?
  require('./InjectFeature.js') : fc_descriptor_InjectFeature;

var MethodFeature = 'undefined' === typeof fc_descriptor_MethodFeature ?
  require('./MethodFeature.js') : fc_descriptor_MethodFeature;

var TagAttributeFeature = 'undefined' === typeof fc_descriptor_TagAttributeFeature ?
  require('./TagAttributeFeature.js') : fc_descriptor_TagAttributeFeature;

var EventBusFeature = 'undefined' === typeof fc_descriptor_EventBusFeature ?
  require('./EventBusFeature.js') : fc_descriptor_EventBusFeature;

var EventHandlerFeature = 'undefined' === typeof fc_descriptor_EventHandlerFeature ?
  require('./EventHandlerFeature.js') : fc_descriptor_EventHandlerFeature;

var OnDemandFeature = 'undefined' === typeof fc_descriptor_OnDemandFeature ?
  require('./OnDemandFeature.js') : fc_descriptor_OnDemandFeature;

var AtFeature = 'undefined' === typeof fc_descriptor_AtFeature ?
  require('./AtFeature.js') : fc_descriptor_AtFeature;

var injectF = new InjectFeature(FinalClass);
FinalClass.features(injectF.descriptorFeatureName, injectF);

var methodF = new MethodFeature(FinalClass);
FinalClass.features(methodF.descriptorFeatureName, methodF);

var tagAttrF = new TagAttributeFeature(FinalClass);
FinalClass.features(tagAttrF.descriptorFeatureName, tagAttrF);

var eventBusF = new EventBusFeature(FinalClass);
FinalClass.features(eventBusF.descriptorFeatureName, eventBusF);

var eventHandlerF = new EventHandlerFeature(FinalClass);
FinalClass.features(eventHandlerF.descriptorFeatureName, eventHandlerF);

var onDemandF = new OnDemandFeature(FinalClass);
FinalClass.features(onDemandF.descriptorFeatureName, onDemandF);

var atF = new AtFeature(FinalClass);
FinalClass.features(atF.descriptorFeatureName, atF);
