const fetch = require('node-fetch');
const emoji = require('..');

async function main() {
    const dog = emoji.of('dog');
    console.log('Trying to fetch URL:', dog.url);

    try {
        const res = await fetch(dog.url);
        if (!res.ok) {
            console.error('Response is not successful', res);
            return 1;
        }

        console.log('OK!');
        return 0;
    } catch (err) {
        console.error('Failed to fetch', err);
        return 1;
    }
}

main().then(process.exit);
