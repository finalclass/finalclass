/*jslint node:true,browser:true,evil:true,sloppy:true*/
/*global FinalClass, jQuery*/

var FinalClass = FinalClass || require('../FinalClass.js');

var fc_display_TemplateLoader = module.exports = new FinalClass({
        className: 'fc_display_TemplateLoader',
        isBean: true,
        beanName: 'fc_display_TemplateLoader',
        parents: [
            FinalClass.db('fc_EventEmitter')
        ],
        descriptor: {
            promises: {
                value: {}
            },
            query: {
                inject: 'fc_utils_FinalJQuery'
            },
            load: {
                value: function (url, callback) {
                    var promise = this.promises[url];

                    if (!promise) {
                        promise = this.query.ajax({url: url});
                        this.promises[url] = promise;
                    }

                    promise.done(callback);
                }
            }
        }
    });