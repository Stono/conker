# conker
A simple concurrency manager for nodejs.  Basically this is to facilitate situations where you want to control the maximum number of async delegates that can be executed at any time for a single "concurrency key".

## Getting Started
Install the module with: `npm install conker`

## Examples
I have a remote API server, and want to ensure that I do no more than a maximum of 1 request at any given time, and subsequence requests should be queued until that point.
```javascript
var conker = new require('conker')({
  maxPerKey: 1
});

var concurrencyKey = 'some-api-identifier';
conker
  .start(concurrencyKey, function(callback) {
    myApi.doSomething(callback);
  })
  .then(function(result) {
    // Success!  
  })
  .then(null, function(err) {
    // Fail :'(
  });

conker
  .start(concurrencyKey, function(callback) {
    // This request wont happen until the request above completes or fails, as our maxPerKey is set to 1
    myApi.doSomethingElse(callback);
  })
  .then(function(result) {
    // Success!  
  })
  .then(null, function(err) {
    // Fail :'(
  });
```

## Contributing
TDD please.  Write a test, pass it, refactor it and then submit a merge request.

## Release History
0.1.0 - Initial Release

## License
Copyright (c) 2014 Karl Stoney  
Licensed under the MIT license.
