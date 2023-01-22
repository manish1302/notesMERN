const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { render } = require('ejs');
const app = express();

mongoose.set("strictQuery", false); // for deprecating warning
mongoose.connect('mongodb://localhost:27017/signin');

// mongoose schema
const userName = new mongoose.Schema({
    userName: String,
    password: String
});

const signIn = mongoose.model("signin", userName); // database
const port = process.env.PORT || 7000;
app.use(bodyParser.urlencoded({ extended: true }));


app.set("view engine", "ejs");
// loading static assets
app.use('/static', express.static(path.join(__dirname, 'public')))

// home page..route

app.get('/', (req, res) => {
    res.render("base.ejs", { title: "Sign Up" });
})

app.get('/login', (req, res) => {
    res.render("login.ejs")
})

app.get('/home', (req, res) => {
    res.render("home.ejs");
})

app.get('/incorrect', (req, res) => {
    res.render("incorrect.ejs");
})

app.post('/', async (req, res) => {
    const newdata = await new signIn({
        userName: req.body.username,
        password: req.body.password
    })

    newdata.save();
    res.redirect('/login');
})

app.post('/login', async (req, res) => {
    const loginUsername = await req.body.username;
    const loginPassword = await req.body.password;

    signIn.find((err, resp) => {
        if (err) {
            console.log(err);
        }
        else {
            let a = false;
            for (let i = 0; i < resp.length; i++) {
                if (resp[i].userName === loginUsername && resp[i].password === loginPassword) {
                    a = true;
                    break;
                }
            }

            if (!a) res.redirect("/incorrect");
            else { res.redirect('/home') }
        }
    });

})

app.listen(port)