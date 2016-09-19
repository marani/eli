Zendesk Frontend Test 1 Solution

Environment: node >= 4

Step 1: From some directory
```
npm init
npm i marani/eli --save
```

Step 2: Create some test
```
var compress = require('eli').compress;
var checkURIs = require('eli').checkURIs;

// some sample usage
console.log(checkURIs(
  'http://x:y@abc.com:81/~smith/home.html#abc',
  'http://x::y@ABC.com:80/%7Esmith/home.html#abc'));
console.log(compress('aaaaaabbbdg'));
```
