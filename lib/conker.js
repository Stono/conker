'use strict';
var utils = require('./utils');
var when = require('when');

var Conker = function(opts) {
  utils.constraints.checkNotNull(opts, 'opts');
  utils.constraints.checkNotNull(opts.maxPerKey, 'opts.maxPerKey');

  var activeJobs = {};
  var queuedJobs = {};
  var self = {};

  var Job = function(delegate, onComplete) {
    var run = function(runCompleteCallback) {
      try {
        delegate(function(err) {
          onComplete(err);
          runCompleteCallback();
        });
      } catch(ex) {
        onComplete(ex.message);
        runCompleteCallback();
      }
    };
    return Object.freeze({
      run: run,
      complete: onComplete
    });
  };

  var runNext = function(id) {
    if(activeJobs[id].length < opts.maxPerKey && queuedJobs[id].length > 0) {
      var job = queuedJobs[id].shift();
      activeJobs[id].push(job);
      job.run(function() {
        activeJobs[id].splice(activeJobs[id].indexOf(job), 1);
        runNext(id);
      });
    }
  };

  self.start = function(id, delegate) {
    activeJobs[id] = utils.constraints.defaultValue(activeJobs[id], []);
    queuedJobs[id] = utils.constraints.defaultValue(queuedJobs[id], []);
    return when.promise(function(resolve, reject) {
      var job = new Job(delegate, function(err) {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      });
      queuedJobs[id].push(job);
      runNext(id);
    });
  };

  return Object.freeze(self);
};

module.exports = Conker;
