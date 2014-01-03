# Gingerbread

A wrapper around Ginger proofreader for correcting spelling and grammar mistakes based on the context of complete sentences.

## Installation

```bash
npm install gingerbread
```

## Usage

```javascript
var gingerbread = require('gingerbread');

gingerbread('The smelt of fliwers bring back memories.', function (error, text, result, corrections) {
  // result contains 'The smell of flowers brings back memories.'
});

```
