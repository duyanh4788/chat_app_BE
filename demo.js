// process.env.UV_THREADPOOL_SIZE = 5

const https = require('https')
const crypto = require('crypto')
const fs = require('fs')


const s = Date.now()

function doRequest() {
    https.request('https://www.google.com', res => {
        res.on('data', () => { })
        res.on('end', () => {
            console.log('https', Date.now() - s)
        })
    })
        .end()
}

function doHash() {
    crypto.pbkdf2('a', 'b', 10000, 512, 'sha512', () => {
        console.log('hash', Date.now() - s)
    })
}


doRequest();

fs.readFile('demo.js', 'utf-8', () => {
    console.log('fs', Date.now() - s)
})

doHash();
doHash();
doHash();
doHash();