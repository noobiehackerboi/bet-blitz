const mongoose = require('mongoose')
const dotenv = require('dotenv');

// FILE STRUCTURE IN MONGO DB
// Bet-BLitz
// Collections ->
// Database ->

dotenv.config();
const mongoURL = `mongodb+srv://${process.env.ADMIN}:${process.env.PASSWORD}@bet-blitz.cnjfaur.mongodb.net/?retryWrites=true&w=majority`

const connectToMongo = async () => {
    await mongoose.connect(mongoURL).
        then(() => console.log("Connected successfully")).
        catch(err => console.log(err));
}

module.exports = connectToMongo;