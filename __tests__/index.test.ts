import * as emoji from '..';
import * as path from 'path';
import * as fs from 'fs';

describe('isEmoji()', () => {
    test('emojis', () => {
        expect(emoji.isEmoji('🐶')).toBe(true);
        expect(emoji.isEmoji('🐕')).toBe(true);
    });
    test('not a emoji', () => {
        expect(emoji.isEmoji('dog')).toBe(false);
        expect(emoji.isEmoji('犬')).toBe(false);
        expect(emoji.isEmoji('✧＼٩(U‘ω’U)و /／✧')).toBe(false);
    });
});

describe('nameOf()', () => {
    test('emojis', () => {
        expect(emoji.nameOf('🐶')).toBe('dog');
        expect(emoji.nameOf('🐕')).toBe('dog2');
    });
    test('not a emoji', () => {
        expect(emoji.nameOf('dog')).toBe(null);
        expect(emoji.nameOf('犬')).toBe(null);
        expect(emoji.nameOf('✧＼٩(U‘ω’U)و /／✧')).toBe(null);
    });
});

describe('isName()', () => {
    test('correct names', () => {
        expect(emoji.isName('dog')).toBe(true);
        expect(emoji.isName('dog2')).toBe(true);
    });
    test('not a emoji', () => {
        expect(emoji.isName('doggo')).toBe(false);
        expect(emoji.isName('犬')).toBe(false);
        expect(emoji.isName('✧＼٩(U‘ω’U)و /／✧')).toBe(false);
    });
});

describe('stringOf()', () => {
    test('correct names', () => {
        expect(emoji.stringOf('dog')).toBe('🐶');
        expect(emoji.stringOf('dog2')).toBe('🐕');
    });
    test('not a emoji', () => {
        expect(() => emoji.stringOf('doggo')).toThrowError("Emoji named 'doggo' not found");
        expect(() => emoji.stringOf('犬')).toThrowError("Emoji named '犬' not found");
    });
    test('non-unicode emoji', () => {
        expect(emoji.stringOf('shipit')).toBe(null);
        expect(emoji.stringOf('octocat')).toBe(null);
    });
});

describe('of()', () => {
    test('correct names', () => {
        const e = emoji.of('dog');
        expect(e.string).toEqual('🐶');
        expect(e.url).toMatch(/[a-f0-9]+\.png\?v\d+$/);
        expect(e.url).toMatch(/^https:\/\//);
        expect(e.url).toMatch(e.file);
        expect(e.file).toMatch(/^[a-f0-9]+\.png$/);
        expect(fs.existsSync(path.dirname(e.path))).toBe(true);
        expect(e.path).toMatch(e.file);
        expect(e.name).toBe('dog');
    });
    test('not a emoji', () => {
        expect(() => emoji.of('doggo')).toThrowError("Emoji named 'doggo' not found");
        expect(() => emoji.of('犬')).toThrowError("Emoji named '犬' not found");
    });
    test('non-unicode emoji', () => {
        const e = emoji.of('octocat');
        expect(e.string).toBe(null);
    });
});

describe('all()', () => {
    test('multiple emojis', () => {
        expect(emoji.all().size).toBeGreaterThan(1);
    });
    test('all emojis work fine', () => {
        emoji.all().forEach((e, name) => {
            expect(e.name).toBe(name);
            expect(emoji.isName(e.name)).toBe(true);
            if (e.string !== null) {
                expect(emoji.isEmoji(e.string)).toBe(true);
            }
            expect(emoji.stringOf(e.name)).toBe(e.string);
            expect(e.url).toMatch(/\.png\?v\d+$/);
            expect(e.url).toMatch(/^https:\/\//);
            expect(e.url).toMatch(e.file);
            expect(e.file).toMatch(/\.png$/);
            expect(e.path).toMatch(e.file);
        });
    });
});
