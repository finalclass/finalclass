/*jslint node: true, browser: true*/
/*global */
'use strict';

var FinalClass = module.exports = function (options) {
    return FinalClass.create(options);
};

var fc = FinalClass;

var ObjectDescriptor = ObjectDescriptor || require('./ObjectDescriptor.js');

Object.defineProperties(FinalClass, {

    db: {
        value: function (item, value) {
            if (!item) {
                return this.db;
            }
            if (value !== undefined) {
                fc.db[item] = value;
            }
            return fc.db[item];
        }
    },

    templates: {
        value: function (item, value) {
            if (!item) {
                return this.templates;
            }
            if (value !== undefined) {
                fc.templates[item] = value;
            }
            return fc.templates[item];
        }
    },

    tags: {
        value: function (item, value) {
            if (!item) {
                return this.tags;
            }
            if (value !== undefined) {
                fc.tags[item] = value;
            }
            return fc.tags[item];
        }
    },

    features: {
        value: function (feature, value) {
            if (feature === undefined) {
                return fc.features;
            }
            if (value === undefined) {
                return fc.features[feature];
            }
            fc.features[feature] = value;
        }
    },

    mergeDescriptors: {
        value: function (descriptors) {
            var d, desc, output, property, propertyDescriptor, description;

            //We got structure like that:
            //descriptors = [
            //  {
            //      /**
            //       * @constructs
            //       */
            //      displayObject: {
            //          value: function () {}
            //      },
            //      property: {
            //          beforeInit: function () {}
            //      }
            //  },
            //  {
            //      property: {
            //          beforeInit: function () {}
            //      }
            //  }
            //]
            output = {};

            for (d = 0; d < descriptors.length; d += 1) {
                desc = descriptors[d];
                for (property in desc) {
                    if (desc.hasOwnProperty(property)) {
                        propertyDescriptor = desc[property];
                        output[property] = {};
                        for (description in propertyDescriptor) {
                            if (propertyDescriptor.hasOwnProperty(description)) {
                                output[property][description] = propertyDescriptor[description];
                            }
                        }
                    }
                }
            }

            return output;
        }
    },

    updateHTMLTags: {
        value: function (items, context) {
            var t, tag, tagName, ClassConstructor, displayObject, a, attr;

            for (t = 0; t < items.length; t += 1) {
                tag = items[t];
                tagName = tag.tagName.toLowerCase();
                ClassConstructor = FinalClass.tags[tagName];

                if (ClassConstructor) {
                    displayObject = new ClassConstructor();
                    displayObject.context = context;
                    displayObject.content = tag.innerHTML;

                    //Copy attributes
                    for (a = 0; a < tag.attributes.length; a += 1) {
                        attr = tag.attributes.item(a);
                        displayObject[attr.nodeName] = attr.nodeValue;
                    }

                    //Insert into the dom by replacing the hook
                    tag.parentNode.replaceChild(displayObject.dom.get(0), tag);
                }
            }
        }
    },
    createDescriptorFromPlainObject: {
        value: function (obj) {
            var property,
                descriptor = {};

            for (property in obj) {
                if (obj.hasOwnProperty(property)) {
                    descriptor[property] = Object.getOwnPropertyDescriptor(obj, property);
                }
            }

            return descriptor;
        }
    },
    /**
     * Returns new class.
     *
     * @type {Object}
     */
    create: {
        value: function (options) {
            var p, parent, NewClass, finalDescriptor,
                parentsDescriptors,
                mergedDescriptor,
                lastParent,
                parent,
                stdDescriptor;

            options.className = options.className || 'undefined';
            options.parents = options.parents || [];
            options.descriptor = options.descriptor || {};

            lastParent = options.parents[options.parents.length - 1];

            parentsDescriptors = [];

            for (p = 0; p < options.parents.length; p += 1) {
                parent = options.parents[p];

                if (!parent) {
                    throw new Error('Wrong parent `' + parent + '` for class `' + options.className + '`');
                }
                if (parent.descriptor instanceof ObjectDescriptor) {
                    parentsDescriptors.push(parent.descriptor.getAll());
                } else {
                    parentsDescriptors.push(this.createDescriptorFromPlainObject(parent.prototype));
                }
            }

            finalDescriptor = new ObjectDescriptor(FinalClass);
            finalDescriptor.className = options.className;
            finalDescriptor.parents = options.parents;
            finalDescriptor.tagName = options.tagName;

            // -----------------------------------------
            // stdDescriptor
            // -----------------------------------------

            stdDescriptor = {
                className: {
                    value: options.className
                },
                descriptor: {
                    value: finalDescriptor
                }
            };

            // -----------------------------------------
            // merge descriptor
            // -----------------------------------------

            mergedDescriptor = FinalClass.mergeDescriptors(parentsDescriptors.concat([
                options.descriptor,
                stdDescriptor
            ]));

            if (!mergedDescriptor[options.className]) {
                mergedDescriptor[options.className] = {
                    value: function () {}
                };
            }

            // -----------------------------------------
            // create new Class
            // -----------------------------------------

            NewClass = function (options) {
                var constructor;
                this.descriptor.invokeFeatures(this, FinalClass.features, 'beforeConstructor');
                this.descriptor.dispatch('beforeConstructor', this, {type: 'beforeConstructor'});
                constructor = this.descriptor.get(this.className);
                constructor.value.apply(this, arguments);
                this.descriptor.dispatch('afterConstructor', this, {type: 'afterConstructor'});
                return this;
            };

            NewClass.descriptor = finalDescriptor;
            if (lastParent) {
                NewClass.prototype = Object.create(lastParent.prototype, {
                    constructor: {
                        value: NewClass,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
            }

            finalDescriptor.describe(NewClass.prototype, mergedDescriptor);
            fc.db(options.className, NewClass);

            if (options.tagName) {
                FinalClass.tags[options.tagName] = NewClass;
            }

            return NewClass;
        }
    }
});

if ('undefined' === typeof window) {
    //Load standard library
    require('./descriptor/featuresWireUp.js');
    //require('./utils/FinalJQuery.js');
    require('./EventEmitter.js');
    require('./Provider.js');
    require('./FinalApp.js');
} else {
    $(function () {
        FinalClass.updateHTMLTags($('*'));
    });
}