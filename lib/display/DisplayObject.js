/*jslint node:true,browser:true,evil:true,sloppy:true*/
/*global FinalClass, jQuery*/

var FinalClass = FinalClass || require('../FinalClass.js');

var fc_display_DisplayObject = module.exports = new FinalClass({
        className: 'fc_display_DisplayObject',
        parents: [
            FinalClass.db('fc_EventEmitter'),
            FinalClass.db('fc_display_DisplayObjectInteractivity')
        ],
        descriptor: {
            id: {
                tagAttribute: true
            },
            query: {
                inject: 'fc_utils_FinalJQuery'
            },
            tagName: {
                beforeConstructor: function (argv) {
                    this.tagName = argv.tagName || this.className;
                }
            },
            evaluate: {
                value: function (what) {
                    var context = this.context || this;
                    return eval('with(context) {' + what + '}');
                }
            },
            /**
             * Set this variable to url point to your html view.
             * If this attribute is set then view will be downloaded
             * 
             * @type {String}
             */
            viewURL: {
                value: undefined
            },
            content: {
                set: function (val) {
                    this['@content'] = this.query.trim(val);
                },
                get: function () {
                    return this['@content'];
                }
            },
            context: {
                get: function () {
                    return this['@context'];
                },
                set: function (ctx) {
                    this['@context'] = ctx;
                    if (ctx) {
                        ctx.on('propertyChange', function (event) {
                            this.emit({
                                type: 'contextPropertyChange',
                                property: event.property
                            });
                        }.bind(this));
                    }
                }
            },
            visible: {
                on: {
                    beforeConstructor: function () {
                        this['@visible'] = true;
                    },
                    viewChange: function () {
                        this.visible = this['@visible'];
                    },
                    contextPropertyChange: function () {
                        this.visible = this['@visible'];
                    }
                },
                get: function () {
                    return typeof this['@visible'] === 'string' ? this.evaluate(this['@visible']) : this['@visible'];
                },
                set: function (val) {
                    this['@visible'] = val;
                    val = typeof val === 'string' ? this.evaluate(val) : val;
                    if (val) {
                        this.dom.show();
                    } else {
                        this.dom.hide();
                    }
                    this.emit('propertyChange');
                }
            },
            onTemplateLoaded: {
                method: true,
                value: function (result) {
                    var res, children;

                    FinalClass.templates(this.className, result);
                    res = this.query(result);
                    this.dom.replaceWith(res);
                    this.dom = res;
                    this.dom.data('fc-object', this);
                    FinalClass.updateHTMLTags(this.dom.find('*'), this);

                    this.dom.find('[id]').each(function (i, item) {
                        var child = this.query(item),
                            id = child.attr('id'),
                            fcObject = child.data('fc-object');
                        if (this[id] !== undefined) {
                            throw new Error('id (' + id + ') already in use, choose different for ' + this.descriptor.tagName);
                        }
                        this[id] = fcObject || child;
                    }.bind(this));

                    this.emit({type: 'viewChange'});
                }
            },
            templateLoader: {
                inject: 'fc_display_TemplateLoader',
            },
            dom: {
                bindable: true,
                on: {
                    beforeConstructor: function () {
                        var tpl;

                        if (FinalClass.templates(this.className) !== undefined) {
                            tpl = FinalClass.templates(this.className);
                        } else {
                            tpl = '<' + this.descriptor.tagName + '/>';
                            if (this.viewURL) {
                                this.templateLoader.load(this.viewURL, this.onTemplateLoaded);
                            }
                        }
                        this.dom = this.query(tpl).data('fc-object', this);
                    }
                }
            }
        }
    });

