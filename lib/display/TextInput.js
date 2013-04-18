/*jslint node:true,browser:true*/
/*global FinalClass, jQuery*/
'use strict';
var $ = this.hasOwnProperty('jQuery') ? this.jQuery : require('jquery');
var FinalClass = FinalClass || require('../FinalClass.js');

/**
 * @class {display_TextInput}
 */
var fc_display_TextInput = module.exports = new FinalClass({
    className: 'fc_display_TextInput',
    parents: [FinalClass.db('fc_display_DisplayObject')],
    tagName: 'fc:textinput',
    descriptor: {
        fc_display_TextInput: {
            value: function () {
                this.fc_display_DisplayObject();
            }
        },
        dom: {
            on: {
                beforeConstructor: function () {
                    var that = this;
                    this.dom = this.query('<div contenteditable="true"/>')
                        .on(
                            ['keydown', 'keyup', 'change', 'focusIn', 'focusOut', 'load',
                                'mouseover', 'mouseout', 'mousemove', 'mousedown', 'mouseup'],
                            function (event) {
                                that.emit(event);
                            }
                        );
                }
            }
        },
        text: {
            get: function () {
                return this.dom.html();
            },
            set: function (htmlText) {
                this.dom.html(htmlText);
                this.emit({
                    type: 'propertyChange',
                    property: 'text',
                    data: htmlText
                });
            },
            on: {
                keyup: function (event) {
                    this.emit({
                        type: 'propertyChange',
                        property: 'text',
                        data: this.text
                    });
                }
            }
        }
    }
});