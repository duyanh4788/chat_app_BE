const express = require('express');
const app = express();
const Worker = require('web-worker')

app.get('/', (req, res) => {
    let count = 0;
    while (count < 1e9) {
        count++
    }
    const worker = new Worker(`data:,postMessage(${count})`)
    worker.onmessage = (e) => {
        console.log(e)
        res.send(`this is number: ${e.data}`)
    }
    worker.postMessage()
})

app.get('/test', (req, res) => {
    res.send('test............')
})


app.listen(5000, () => {
    console.log('running 5000')
})