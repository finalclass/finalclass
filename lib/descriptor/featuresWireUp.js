/*jslint node:true, browser:true*/
'use strict';

var FinalClass = FinalClass || require('../FinalClass.js');

//Init standard features
var InjectFeature = 'undefined' === typeof fc_descriptor_InjectFeature ?
                require('./InjectFeature.js') : fc_descriptor_InjectFeature,

    MethodFeature = 'undefined' === typeof fc_descriptor_MethodFeature ?
                require('./MethodFeature.js') : fc_descriptor_MethodFeature,

    TagAttributeFeature = 'undefined' === typeof fc_descriptor_TagAttributeFeature ?
                require('./TagAttributeFeature.js') : fc_descriptor_TagAttributeFeature;

var injectF = new InjectFeature(FinalClass);
FinalClass.features(injectF.descriptorFeatureName, injectF);

var methodF = new MethodFeature(FinalClass);
FinalClass.features(methodF.descriptorFeatureName, methodF);

var tagAttrF = new TagAttributeFeature(FinalClass);
FinalClass.features(tagAttrF.descriptorFeatureName, tagAttrF);