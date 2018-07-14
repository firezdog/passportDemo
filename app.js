var express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    localStrategy = require('passport-local'),
    localMongoose = require('passport-local-mongoose'),
    User = require('./models/user');

mongoose.connect("mongodb://localhost:27017/auth", { useNewUrlParser:true});

var app = express();
app.use(express.static('static'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('express-session')({
    secret: "dasnichtselbstnichtet",
    resave: false,
    saveUninitialized: false
}));

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/secret", function(req, res){
    res.render("secret");
});

app.post(
    "/login", 
    passport.authenticate(
        "local", 
        {
            successRedirect: "/secret", 
            failureRedirect: "/login"
        }), 
    function(req, res){
    }
);

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err,user){
        if(err){ 
            res.render('register', {err: err});
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/secret");
        });
    });
})

app.listen(8000, process.env.IP, function(){
    console.log("Running on Port 8000");
});