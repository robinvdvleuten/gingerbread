# Gingerbread

A wrapper around Ginger proofreader for correcting spelling and grammar mistakes based on the context of complete sentences.

[![NPM version](https://img.shields.io/npm/v/gingerbread.svg?style=flat-square)](https://www.npmjs.com/package/gingerbread)
[![Build Status](https://img.shields.io/travis/robinvdvleuten/gingerbread.svg?style=flat-square)](https://travis-ci.org/robinvdvleuten/gingerbread)

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

## Command Line Interface

Install the cli through NPM with:

```bash
npm install gingerbread -g
```

and run with:

```bash
gingerbread --help
```

## Thanks

Thank you for [Ginger Proofreader](http://www.gingersoftware.com/) for such awesome service. Hope they will keep it free :)

Thanks to @subosito for this inspriration [https://github.com/subosito/gingerice](https://github.com/subosito/gingerice) (Ruby Gem)
