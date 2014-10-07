'use strict';
var Conker = require('../index');
var should = require('should');

describe('Conker', function() {
  it('Should enforce opts.maxPerKey as a required paramter', function() {
    /*jshint immed: false */
    (function() {
      var test = new Conker({});
      test = null;
    }).should.throw('opts.maxPerKey is null or undefined');
  });

  it('Should block requests to the same identifier until one has completed', function(done) {
    var scheduler = new Conker({
      maxPerKey: 1
    });
    var firstDone = false;
    scheduler.start(1, function(callback) {
      setTimeout(function() {
        callback();
      }, 500);
    })
    .then(function() {
      firstDone = true;
    });

    scheduler.start(1, function(callback) {
      callback();
    })
    .then(function() {
      if(firstDone === false) {
        done(new Error('Delegate two finished before delegate one.'));
      } else {
        done();
      }
    });
  });

  it('Should execute the next task even if the first returns an error', function(done) {
    var scheduler = new Conker({
      maxPerKey: 1
    });
    scheduler.start(1, function(callback) {
      callback('This is an error'); 
    })
    .then(function() {
      console.log('done');
      done(new Error('This should never be executed as this task failed'));
    }).then(null, function(err) {
      should(err).eql('This is an error');
    });

    scheduler.start(1, function(callback) {
      callback();
    })
    .then(function() {
      done();
    });
  });

  it('Should execute the next task even if the first throws an error', function(done) {
    var scheduler = new Conker({
      maxPerKey: 1
    });
    scheduler.start(1, function() {
      throw new Error('This is an error'); 
    })
    .then(function() {
      console.log('done');
      done(new Error('This should never be executed as this task failed'));
    }).then(null, function(err) {
      should(err).eql('This is an error');
    });

    scheduler.start(1, function(callback) {
      callback();
    })
    .then(function() {
      done();
    });
  });
});
