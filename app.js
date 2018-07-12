var express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    localStrategy = require('passport-local'),
    localMongoose = require('passport-local-mongoose'),
    User = require('./models/user');

mongoose.connect("mongodb://localhost:27017/auth", { useNewUrlParser:true});

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('express-session')({
    secret: "dasnichtselbstnichtet",
    resave: false,
    saveUninitialized: false
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/secret", function(req, res){
    res.render("secret");
});

app.post("/login", function(req, res){
    res.json(req.body);
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    res.json(req.body);
})

app.listen(8000, process.env.IP, function(){
    console.log("Running on Port 8000");
});