import URLS from './emoji.json';
import { join, basename } from 'path';

export { URLS };
export type EmojiName = keyof typeof URLS;
export interface Emoji {
    name: EmojiName[];
    url: string;
    file: string;
    path: string;
    string: string | null;
}

export type Emojis = Map<string, Emoji>;

let cache: Emojis | null = null;
let index: Map<string, EmojiName[]> | null = null;
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

function buildCache(): Emojis {
    cache = new Map();
    index = new Map();
    for (const name of Object.keys(URLS)) {
        const url = URLS[name as EmojiName];
        const file = fileOf(url);
        const str = strOf(file);

        let names: EmojiName[] = [];
        if (str !== null) {
            const arr = index.get(str);
            if (arr === undefined) {
                names = [name as EmojiName];
                index.set(str, names);
            } else {
                arr.push(name as EmojiName);
                names = arr;
            }
        }

        const emoji = {
            name: names,
            url,
            file,
            path: join(IMAGES_BASE, file),
            string: str,
        };
        cache.set(name as EmojiName, emoji);
    }
    return cache;
}

function stringToName(): Map<string, EmojiName[]> {
    if (index === null) {
        buildCache();
    }
    return index!;
}

export function isEmoji(emoji: string): boolean {
    return stringToName().has(emoji);
}

export function nameOf(emoji: string): EmojiName[] {
    return stringToName().get(emoji) || [];
}

export function isName(name: string): name is EmojiName {
    return name in URLS;
}

export function stringOf(name: string): string | null {
    if (!(name in URLS)) {
        throw new Error(`Emoji named '${name}' not found`);
    }
    if (cache !== null) {
        return cache.get(name)!.string;
    }
    return strOf(fileOf(URLS[name as EmojiName]));
}

export function of(name: string): Emoji {
    const e = all().get(name);
    if (e === undefined) {
        throw new Error(`Emoji named '${name}' not found`);
    }
    return e;
}

export function all(): Emojis {
    if (cache === null) {
        buildCache();
    }
    return cache!;
}
