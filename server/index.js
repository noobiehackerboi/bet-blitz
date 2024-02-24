const express = require('express')
const connectToMongo = require('./db')

const app = express()
const port = 5000
connectToMongo();

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Bet-Blitz-App listening on port http://localhost:${port}`)
})