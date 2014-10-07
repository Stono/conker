'use strict';

module.exports = {
  constraints: {
    checkNotNull: function(obj, paramName) {
      if (obj === undefined || obj === null) {
        var error = paramName + ' is null or undefined';
        throw new Error(error);
      }
    },
    defaultValue: function(obj, defaultValue) {
      return obj || defaultValue;
    }
  }
};
