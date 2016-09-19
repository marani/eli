Zendesk Frontend Test 1 Solution
Environment: node >= 4.

Step 1:
```npm i marani/eli --save```

Step 2:
```
var compress = require('eli').compress;
var checkURIs = rqeuire('eli').checkURIs;

console.log(checkURIs(
  'http://x:y@abc.com:81/~smith/home.html#abc',
  'http://x::y@ABC.com:80/%7Esmith/home.html#abc'));
console.log(compress('aaaaaabbbdg'));
```
