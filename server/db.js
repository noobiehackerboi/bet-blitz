const mongoose = require('mongoose')
const dotenv = require('dotenv');

// FILE STRUCTURE IN MONGO DB
// Bet-BLitz
// Collections -> data
// Database -> users (where signed up users data is stored), matches (where matches are stored), betting (where individual bets are placed)

dotenv.config();
const mongoURL = `mongodb+srv://${process.env.ADMIN}:${process.env.PASSWORD}@bet-blitz.cnjfaur.mongodb.net/data?retryWrites=true&w=majority`

const connectToMongo = async () => {
    await mongoose.connect(mongoURL).
        then(() => console.log("Connected successfully")).
        catch(err => console.log(err));
}

module.exports = connectToMongo;