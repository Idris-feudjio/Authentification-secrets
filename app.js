const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const { get } = require("http");
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/authentificationDB');

const userSchema = mongoose.Schema({
    userName : String,
    password : String
});
const User = mongoose.model('User',userSchema);

app.get('/', (req, res) => {
    res.send('Hello world !');
})

app.listen(3000, () => {
    console.log('server start at port 3000');
})