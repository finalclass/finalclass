/*jslint node:true,browser:true,evil:true,sloppy:true*/
/*global FinalClass, jQuery*/

var FinalClass = FinalClass || require('../FinalClass.js');

var fc_display_List
        = module.exports
        = new FinalClass({
            className: 'fc_display_List',
            tagName: 'fc:list',
            parents: [FinalClass.db('fc_display_DisplayObject')],
            descriptor: {
                fc_display_List: {
                    value: function () {
                        this.fc_display_DisplayObject();
                    }
                },
                dataprovider: {
                    get: function () {
                        return this['@dataprovider'];
                    },
                    set: function (val) {
                        val = typeof val === 'string' ? this.evaluate(val) : val;
                        this['@dataprovider'] = val;
                        this.emit('propertyChange');
                        this.redraw();
                    }
                },
                redraw: {
                    value: function () {
                        var i, item, $list, $item;

                        $list = this.query();
                        this.dom.empty();
                        for (i = 0; i < this.dataprovider.length; i += 1) {
                            item = this.dataprovider[i];
                            $item = this.query(this.content.replace('item', item));
                            $list.append($item);
                        }
                    }
                },
                dom: {
                    on: {
                        beforeConstructor: function () {
                            this.dom = this.query('<fc:list/>');
                        }
                    }
                }
            }
        });