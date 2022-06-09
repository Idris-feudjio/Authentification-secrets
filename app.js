const express = require("express");
const mongoose = require("mongoose");
// const ejs = require("ejs");
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose'); 
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'Our little secret',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.session());
app.use(passport.initialize())


mongoose.connect('mongodb://localhost:27017/authentificationDB');

const userSchema = new mongoose.Schema({
    userName: String,
    password: String
});
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {

    res.render('home');
})

//////////////////////////////// LOGIN ///////////////////////////
app.route('/login')
    .get((req, res) => {
        res.render('login', { noteMatch: '' });
    })
    .post((req, res) => {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        })
        req.login(user, (err) => {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/secrets');
            });
        });
    })
//////////////////////////////// SECRETS ///////////////////////////
app.get('/secrets', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('secrets');
    } else {
        res.redirect('/login');
    }
}) 

//////////////////////////////// USER REGISTER ///////////////////////////
app.route('/register')
    .get((req, res) => {
        res.render('register');
    })
    .post((req, res) => {
        User.register({ username: req.body.username }, req.body.password, (err, user) => {
            if (err) {
                console.log(err);
                res.redirect('/register');
            } else {
                // res.redirect('/secrets');
                passport.authenticate("local")(req, res, () => {
                    res.redirect('/secrets');
                });
            }
        });

    })


app.listen(3000, () => {
    console.log('server start at port 3000');
})