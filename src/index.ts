import URLS from './emoji.json';
import { join, basename } from 'path';

export { URLS };
export type EmojiName = keyof typeof URLS;
export interface Emoji {
    name: EmojiName;
    url: string;
    file: string;
    path: string;
    string: string | null;
}

export type Emojis = Map<string, Emoji>;

let cache: Emojis | null = null;
let stringToName: Map<string, EmojiName[]> | null = null;
const IMAGES_BASE = join(__dirname, 'images');
const RE_HEX = /^[0-9a-f-]+$/;

function fileOf(url: string): string {
    return url.slice(url.lastIndexOf('/') + 1, url.lastIndexOf('?'));
}

function strOf(file: string): string | null {
    const base = basename(file, '.png');
    if (!RE_HEX.test(base)) {
        return null;
    }
    if (!base.includes('-')) {
        return String.fromCodePoint(parseInt(base, 16));
    }
    return String.fromCodePoint(...base.split('-').map(s => parseInt(s, 16)));
}

function emojiOf(name: EmojiName): Emoji {
    const url = URLS[name];
    const file = fileOf(url);
    return {
        name,
        url,
        file,
        path: join(IMAGES_BASE, file),
        string: strOf(file),
    };
}

function buildStringToName(checkEmoji: string): EmojiName[] {
    stringToName = new Map();
    let ret: EmojiName[] = [];
    for (const [name, info] of all().entries()) {
        if (info.string !== null) {
            let arr = stringToName.get(info.string);
            if (arr === undefined) {
                arr = [name as EmojiName];
                stringToName.set(info.string, arr);
            } else {
                arr.push(name as EmojiName);
            }
            if (info.string === checkEmoji) {
                ret = arr;
            }
        }
    }
    return ret;
}

export function isEmoji(emojiString: string): boolean {
    if (stringToName !== null) {
        return stringToName.has(emojiString);
    }
    return buildStringToName(emojiString).length > 0;
}

export function nameOf(emojiString: string): EmojiName | null {
    const names = namesOf(emojiString);
    if (names.length === 0) {
        return null;
    }
    return names[0];
}

export function namesOf(emojiString: string): EmojiName[] {
    if (stringToName !== null) {
        const name = stringToName.get(emojiString);
        return name || [];
    }
    return buildStringToName(emojiString);
}

export function isName(name: string): name is EmojiName {
    return name in URLS;
}

export function stringOf(name: EmojiName): string | null {
    if (!(name in URLS)) {
        throw new Error(`Emoji named '${name}' not found`);
    }
    if (cache !== null) {
        return cache.get(name)!.string;
    }
    return strOf(fileOf(URLS[name]));
}

export function of(name: EmojiName): Emoji {
    if (!(name in URLS)) {
        throw new Error(`Emoji named '${name}' not found`);
    }
    if (cache !== null) {
        return cache.get(name)!;
    }
    return emojiOf(name as EmojiName);
}

export function all(): Emojis {
    if (cache !== null) {
        return cache;
    }
    cache = new Map();

    for (const key of Object.keys(URLS)) {
        cache.set(key, emojiOf(key as EmojiName));
    }
    return cache;
}
