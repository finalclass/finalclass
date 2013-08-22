/*jslint node:true*/
/*global FinalObject, FinalDisplayObject, FinalPElement, FinalStage, FinalObject, $*/
'use strict';

var FinalClass = FinalClass || require('./FinalClass.js');

var EventEmitter = module.exports = new FinalClass({
    className: 'fc_EventEmitter',
    parents: [],
    descriptor: {
        eventListeners: {
            on: {
                beforeConstructor: function () {
                    this.eventListeners = {};
                }
            }
        },
        getEventListenersForEventType: {
            value: function (eventType) {
                if (!this.eventListeners[eventType]) {
                    this.eventListeners[eventType] = [];
                }
                return this.eventListeners[eventType];
            }
        },
        on: {
            value: function (eventType, callback) {
                this.getEventListenersForEventType(eventType).push(callback);
            }
        },
        emit: {
            value: function (event) {
                var listeners,
                    that = this,
                    l;

                if (typeof event === 'string') {
                    event = {type: event};
                }

                listeners = this.getEventListenersForEventType(event.type);
                //target is an event initiator
                if (!this.target) {
                    event.target = this;
                }
                this.currentTarget = this;

                //call on own listeners
                for (l = 0; l < listeners.length; l += 1) {
                    listeners[l].call(this, event);
                }

                // -----------------------------------------
                // emit event on PARENT
                // -----------------------------------------
                //if object has parent and parent can emit
                if (this.parent && typeof this.parent.emit === 'function') {
                    this.parent.emit(event);
                }

                // -----------------------------------------
                // Event on Parameters
                // -----------------------------------------

                this.descriptor.each(function (descriptor, property) {
                    if (descriptor.on && descriptor.on[event.type]) {
                        descriptor.on[event.type].call(that, event);
                    }
                });

                if (event.type !== 'emit') {
                    this.emit({type: 'emit', event: event});
                }

            }
        }
    }
});