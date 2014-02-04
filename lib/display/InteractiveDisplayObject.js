/*jslint node:true,browser:true*/
/*global FinalClass, jQuery*/
'use strict';

var FinalClass = FinalClass || require('../FinalClass.js');

var fc_display_DisplayObjectInteractivity = module.exports
                  = new FinalClass({
            className: 'fc_display_DisplayObjectInteractivity',
            parents: [FinalClass.db.fc_EventEmitter],
            descriptor: {
                click: {
                    get: function () {
                        return this['@click'];
                    },
                    set: function (val) {
                        this['@click'] = val;
                        this.dom.click(function () {
                            this.evaluate(this.click);
                        }.bind(this));
                        if (!this['@clickViewChangeAdded']) {
                            this.on('viewChange', function () {
                                if (this.click) {
                                    this.dom.click(function () {
                                        this.evaluate(this.click);
                                    }.bind(this));
                                }
                            }.bind(this));
                            this['@clickViewChangeAdded'] = true;
                        }
                    }
                }
            }
        });

