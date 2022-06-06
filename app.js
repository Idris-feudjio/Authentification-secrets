const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser"); 
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
    res.render('home');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.get('/secrets', (req, res) => {
    res.render('secrets');
})

app.listen(3000, () => {
    console.log('server start at port 3000');
})