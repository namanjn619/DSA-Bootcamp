const mongoose = require('mongoose');
const Bootcamp = require('../models/bootcamp');
const questions = require('./questions.js');

//mongoose setup:
mongoose.connect('mongodb://localhost:27017/dsa-bootcamp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Bootcamp.deleteMany({});
    const camp = Bootcamp.insertMany(questions)
        .then(res => {
            console.log(res);
        })
        .catch(e => {
            console.log(e);
        })
    await camp.save();
}



seedDB().then(() => {
    mongoose.connection.close();
});
