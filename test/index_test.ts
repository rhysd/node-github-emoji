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
        deq(emoji.nameOf('🐶'), ['dog']);
        deq(emoji.nameOf('🐕'), ['dog2']);
    });
    it('gets multiple names of emoji', function() {
        deq(emoji.nameOf('👍'), ['+1', 'thumbsup']);
    });
    it('returns null for not a emoji', function() {
        assert.isEmpty(emoji.nameOf('dog'));
        assert.isEmpty(emoji.nameOf('犬'));
        assert.isEmpty(emoji.nameOf('✧＼٩(U‘ω’U)و /／✧'));
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

describe('all()', function() {
    it('returns multiple emojis', function() {
        assert.isAbove(emoji.all().size, 1);
    });
    it('returns all properties of all emojis', function() {
        emoji.all().forEach((e, name) => {
            assert.include(e.name, name);
            assert.isTrue(emoji.isName(e.name));
            eq(emoji.stringOf(e.name), e.string);
            assert.match(e.url, /\.png\?v\d+$/);
            assert.match(e.url, /^https:\/\//);
            assert.include(e.url, e.file);
            assert.match(e.file, /\.png$/);
            assert.include(e.path, e.file);
            if (e.string !== null) {
                assert.isTrue(emoji.isEmoji(e.string));
                const names = emoji.nameOf(e.string);
                assert.include(names, e.name);
            }
        });
    });
});
