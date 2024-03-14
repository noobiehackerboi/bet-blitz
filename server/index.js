const express = require('express')
const connectToMongo = require('./db')

connectToMongo();
const app = express()
const port = process.env.PORT || 5000

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send("Server working fine")
})

app.use('/routes/auth', require("./routes/auth"))
app.use('/routes/mods', require("./routes/mod"))
app.use('/routes/matches', require("./routes/matches"))
app.use('/routes/bets', require("./routes/bets"))

app.listen(port, () => {
    console.log(`Bet-Blitz-App listening on port ${process.env.HOST}:${port}`)
})