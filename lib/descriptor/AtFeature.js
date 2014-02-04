/*jslint node:true,browser:true*/
/*global FinalClass, jQuery*/
'use strict';

var fc_descriptor_AtFeature = module.exports = function (FinalClass) {
  this.fc = FinalClass;
};

fc_descriptor_AtFeature.prototype = Object.create(null, {

  timer: {
    value: null,
    writable: true
  },

  descriptorFeatureName: {
    value: 'at'
  },

  initTimer: {
    value: function () {
      if (this.timer) {
        return;
      }
      this.onTimer = this.onTimer.bind(this);
      this.timer = setInterval(this.onTimer, 60 * 1000); //every minute
    }
  },
  onTimer: {
    value: function () {
      var time = new Date();
      var hour = time.getUTCHours();
      var minute = time.getUTCMinutes();

      this.tasks.forEach(function (task) {
        if (task.hour === hour && task.minute === minute) {
          task.handler.call(task.thisArg);
        }
      });

    },
    writable: true
  },

  tasks: {
    value: []
  },

  beforeDescribing: {
    value: function (object, property, descriptor, pureDescriptor) {
      this.initTimer();
      return pureDescriptor;
    }
  },
  beforeConstructor: {
    value: function (object, property, descriptorFeatureValue) {
      Object.keys(descriptorFeatureValue).forEach(function (key) {
        var split = key.split(':');

        if (split.length !== 2) {
          throw new Error('at feature key has to be in form: HH:mm');
        }

        this.tasks.push({
          hour: parseInt(split[0]),
          minute: parseInt(split[1]),
          handler: descriptorFeatureValue[key],
          thisArg: object
        });
      }, this);

      this.onTimer();
    }
  }
});
