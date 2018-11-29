GitHub Emoji Library for Node.js typed with TypeScript
======================================================

Small [npm package](https://www.npmjs.com/package/github-emoji) for GitHub Emoji typed with TypeScript.

Features:

- Get properties of each emoji
  - Name (e.g. `dog`)
  - URL (e.g. `https://assets-cdn.github.com/images/icons/emoji/unicode/1f436.png?v8`)
  - String (e.g. `🐶`)
  - File path to emoji file (e.g. `/path/to/github-emoji/images/1f436.png`)
  - File name (e.g. `1f436.png`)
- TypeScript ready
  - Emoji name is typed as a union of string literal types. Compiler can check emoji name is correct.

```javascript
const emoji = require('github-emoji');

console.log('All emoji information as Map', emoji.all());
console.log('Get properties of emoji as object', emoji.of('dog'));
console.log('Get emoji string from name', emoji.stringOf('dog'));
console.log('Get emoji name from emoji string', emoji.nameOf('🐶'));
console.log('Check the string is emoji name or not', emoji.isName('dog'));
console.log('Check the string is emoji or not', emoji.isEmoji('🐶'));
```

Please see [index.d.ts](index.d.ts) for interface.

This library is ready for [TypeScript](https://www.typescriptlang.org/).

```typescript
import * as emoji from 'github-emoji';

emoji.of('dog'); // OK
emoji.of('doggo'); // COMPILE ERROR!
```
