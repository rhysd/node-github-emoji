const fetch = require('node-fetch');

function main() {
    const emoji = require('..');
    const dog = emoji.of('dog');
    console.log('Trying to fetch URL:', dog.url);
    return fetch(dog.url);
}

main()
    .catch(err => {
        console.error('Failed to fetch', err);
        process.exit(1);
    })
    .then(res => {
        if (!res.ok) {
            console.error('Response is not successful', res);
            process.exit(1);
        }
        console.log('OK:');
    });
