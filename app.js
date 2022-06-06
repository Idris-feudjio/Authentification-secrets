require('dotenv').config() //We use dotenv pour eviter les arckeurs de telecherger l'app sur Github et aveoir acces au secret code 
const express = require("express");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
const ejs = require("ejs");
const bodyParser = require("body-parser"); 
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


mongoose.connect('mongodb://localhost:27017/authentificationDB');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'username is required']
    },
    password: String
});

//////////////////////////////// ENCRYPT /////////////////////////// 
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] })
const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {

    res.render('home');
})

//////////////////////////////// LOGIN ///////////////////////////
app.route('/login')
    .get((req, res) => {
        res.render('login', { noteMatch: '' });
    })
    .post((req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({ username: username }, (err, user) => {
            if (err) {
                console.log('USER NOT FOUND');
            } else {
                if (user.password === password) {
                    res.render('secrets');
                } else {
                    console.log('USERNAME OR PASSWORD INCORRECT');
                    res.render('login', { noteMatch: 'username or password incorrect' });
                }
            }
        })
    })

//////////////////////////////// USER REGISTER ///////////////////////////
app.route('/register')
    .get((req, res) => {
        res.render('register');
    })
    .post((req, res) => {
        const newUser = new User({
            userName: req.body.username,
            password: req.body.password
        });

        newUser.save((err) => {
            if (!err) {
                console.log('NEW USER SAVE SUCCEFULLY');
            } else {
                console.log(err);
            }
        })
        res.render('secrets');
    })

app.get('/secrets', (req, res) => {
    res.render('secrets');
})



app.listen(3000, () => {
    console.log('server start at port 3000');
})