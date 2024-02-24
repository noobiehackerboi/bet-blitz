const express = require('express')
const connectToMongo = require('./db')

connectToMongo();
const app = express()
const port = 5000

app.use(express.json());

app.use('/routes/auth', require("./routes/auth"));

app.listen(port, () => {
    console.log(`Bet-Blitz-App listening on port http://localhost:${port}`)
})