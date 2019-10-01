GitHub Emoji Library for Node.js typed with TypeScript
======================================================
[![npm version][]][npm]
[![codecov badge][]][codecov]
[![travis badge][]][travis]
[![appveyor badge][]][appveyor]

Small [npm package](https://www.npmjs.com/package/github-emoji) for GitHub Emoji typed with TypeScript.

Features:

- Get properties of each emoji
  - Name (e.g. `dog`)
  - URL (e.g. `https://github.githubassets.com/images/icons/emoji/unicode/1f436.png?v8`)
  - String (e.g. `🐶`)
  - File path to emoji file (e.g. `/path/to/github-emoji/images/1f436.png`)
  - File name (e.g. `1f436.png`)
- TypeScript ready
  - Emoji name is typed as a union of string literal types. Compiler can check emoji name is correct.
- Zero runtime dependency

Installation:

```
npm install --save github-emoji
```

Usage:

```javascript
const emoji = require('github-emoji');

console.log('All emoji information as Map',               emoji.all());           // Map{ '+1' => {...}, ... }
console.log('Get properties of emoji as object',          emoji.of('dog'));       // { string: '🐶', ... }
console.log('Get emoji string from name',                 emoji.stringOf('dog')); // '🐶'
console.log('Get emoji names from emoji string as array', emoji.namesOf('👍'));   // ['+1', 'thumbsup']
console.log('Get emoji one of names from emoji string',   emoji.nameOf('👍'));    // '+1'
console.log('Check the string is emoji name',             emoji.isName('dog'));   // true
console.log('Check the string is emoji',                  emoji.isEmoji('🐶'));;  // true
console.log('Object of name => URL',                      emoji.URLS);            // { '+1': 'https://...', ... }
```

This library is ready for [TypeScript](https://www.typescriptlang.org/).

```typescript
import * as emoji from 'github-emoji';

emoji.of('dog');   // OK
emoji.of('doggo'); // COMPILE ERROR!

// If you want to use string value for emoji name, please assert the string value
// is emoji name using `as`.
import {EmojiName} from 'github-emoji';
const someName: string = ...;
emoji.of(someName as EmojiName); // OK
```

Please see `github-emoji/index.d.ts` for all APIs.

You may need to add `--resolveJsonModule` to `tsc` or `"resolveJsonModule": true` in `compilerOptions`
section of `tsconfig.json` to compile this library. `--outDir` would be also necessary in compile
configuration. `--target` must be `es2015` or later.

For example:

```
tsc your_source.ts --resolveJsonModule --target es2015 --esModuleInterop --moduleResolution node --module commonjs
```


[npm version]: https://badge.fury.io/js/github-emoji.svg
[npm]: https://www.npmjs.com/package/github-emoji
[travis badge]: https://travis-ci.org/rhysd/node-github-emoji.svg?branch=master
[travis]: https://travis-ci.org/rhysd/node-github-emoji
[appveyor badge]: https://ci.appveyor.com/api/projects/status/xaq1x7rid0ikbixq/branch/master?svg=true
[appveyor]: https://ci.appveyor.com/project/rhysd/node-github-emoji/branch/master
[codecov badge]: https://codecov.io/gh/rhysd/node-github-emoji/branch/master/graph/badge.svg
[codecov]: https://codecov.io/gh/rhysd/node-github-emoji
