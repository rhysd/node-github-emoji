import * as emoji from '..';
import { assert } from 'chai';
import * as path from 'path';
import * as fs from 'fs';

const eq = assert.strictEqual;
const deq = assert.deepEqual;

describe('isEmoji()', function() {
    it('checks emojis', function() {
        assert.isTrue(emoji.isEmoji('🐶'));
        assert.isTrue(emoji.isEmoji('🐶'));
        assert.isTrue(emoji.isEmoji('🐕'));
    });
    it('checks not a emoji', function() {
        assert.isFalse(emoji.isEmoji('dog'));
        assert.isFalse(emoji.isEmoji('犬'));
        assert.isFalse(emoji.isEmoji('✧＼٩(U‘ω’U)و /／✧'));
    });
});

describe('nameOf()', function() {
    it('gets name of emojis', function() {
        eq(emoji.nameOf('🐶'), 'dog');
        eq(emoji.nameOf('🐕'), 'dog2');
    });
    it('gets one of multiple names of emoji', function() {
        eq(emoji.nameOf('👍'), '+1');
    });
    it('returns null for not a emoji', function() {
        assert.isNull(emoji.nameOf('dog'));
        assert.isNull(emoji.nameOf('犬'));
        assert.isNull(emoji.nameOf('✧＼٩(U‘ω’U)و /／✧'));
    });
});

describe('namesOf()', function() {
    it('returns names of emojis', function() {
        deq(emoji.namesOf('🐶'), ['dog']);
        deq(emoji.namesOf('🐕'), ['dog2']);
    });
    it('returns multiple names of emoji', function() {
        deq(emoji.namesOf('👍'), ['+1', 'thumbsup']);
    });
    it('returns empty array for not a emoji', function() {
        assert.isEmpty(emoji.namesOf('dog'));
        assert.isEmpty(emoji.namesOf('犬'));
        assert.isEmpty(emoji.namesOf('✧＼٩(U‘ω’U)و /／✧'));
    });
});

describe('isName()', function() {
    it('returns true for correct names', function() {
        assert.isTrue(emoji.isName('dog'));
        assert.isTrue(emoji.isName('dog2'));
    });
    it('returns false for not a emoji', function() {
        assert.isFalse(emoji.isName('doggo'));
        assert.isFalse(emoji.isName('犬'));
        assert.isFalse(emoji.isName('✧＼٩(U‘ω’U)و /／✧'));
    });
});

describe('stringOf()', function() {
    it('returns unicode emoji string for correct names', function() {
        eq(emoji.stringOf('dog'), '🐶');
        eq(emoji.stringOf('dog2'), '🐕');
    });
    it('throws an exception for not a emoji', function() {
        assert.throws(() => emoji.stringOf('doggo'), "Emoji named 'doggo' not found");
        assert.throws(() => emoji.stringOf('犬'), "Emoji named '犬' not found");
    });
    it('returns null for non-unicode emoji', function() {
        assert.isNull(emoji.stringOf('shipit'));
        assert.isNull(emoji.stringOf('octocat'));
    });
});

describe('of()', function() {
    it('returns all emoji properties for correct names', function() {
        const e = emoji.of('dog');
        eq(e.string, '🐶');
        assert.match(e.url, /[a-f0-9]+\.png\?v\d+$/);
        assert.match(e.url, /^https:\/\//);
        assert.include(e.url, e.file);
        assert.match(e.file, /^[a-f0-9]+\.png$/);
        assert.isTrue(fs.existsSync(path.dirname(e.path)));
        assert.include(e.path, e.file);
        eq(e.name, 'dog');
    });
    it('throws an exception for not a emoji', function() {
        assert.throws(() => emoji.of('doggo'), "Emoji named 'doggo' not found");
        assert.throws(() => emoji.of('犬'), "Emoji named '犬' not found");
    });
    it('returns all emoji properties but string is null for non-unicode emoji', function() {
        const e = emoji.of('octocat');
        assert.isNull(e.string, null);
    });
});

function isString(v: any): v is string {
    if (typeof v !== 'string') {
        throw new Error('Type is not string:' + typeof v);
    }
    return true;
}

describe('all()', function() {
    it('returns multiple emojis', function() {
        assert.isAbove(emoji.all().size, 1);
    });
    it('returns all properties of all emojis', function() {
        emoji.all().forEach((e, expected) => {
            const actual = e.name;
            if (!isString(actual)) {
                return;
            }
            eq(actual, expected);
            assert.isTrue(emoji.isName(actual));
            eq(emoji.stringOf(actual), e.string);
            assert.match(e.url, /\.png\?v\d+$/);
            assert.match(e.url, /^https:\/\//);
            assert.include(e.url, e.file);
            assert.match(e.file, /\.png$/);
            assert.include(e.path, e.file);
            if (e.string !== null) {
                assert.isTrue(emoji.isEmoji(e.string));
                const names = emoji.namesOf(e.string);
                assert.include(names, actual);
            }
        });
    });
});
