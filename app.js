const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const saltRounds = 10;


mongoose.connect('mongodb://localhost:27017/authentificationDB');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'username is required']
    },
    password: String
});

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
                if (user) {
                    bcrypt.compare(password, user.password, (error, result) => {
                        if (result === true) {
                            res.render('secrets');
                        } else {
                            console.log('USERNAME OR PASSWORD INCORRECT');
                            res.render('login', { noteMatch: 'username or password incorrect' });
                        }
                    });
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
        bcrypt.hash(req.body.password, saltRounds, function (error, hash) {
            const newUser = new User({
                userName: req.body.username,
                password: hash
            });

            newUser.save((err) => {
                if (!err) {
                    console.log('NEW USER SAVE SUCCEFULLY');
                } else {
                    console.log(err);
                }
            })
            res.render('secrets');
        });

    })

app.get('/secrets', (req, res) => {
    res.render('secrets');
})

app.listen(3000, () => {
    console.log('server start at port 3000');
})