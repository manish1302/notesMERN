const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const { render } = require("ejs");
const { signIn, notes } = require("./models/model");

const app = express();
const port = process.env.PORT || 4500;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));

// connecting to mongodb database
mongoose.set("strictQuery", false);

// sigin in database connection
mongoose.connect("mongodb+srv://admin-srimanish:srimanish@notes.6zoq6uy.mongodb.net/notesDatabase");

// mongoose schema

var loginUsername;

var k1 = "";
// get requests...

app.get("/newNote", (req, res) => {
  res.render("createNote");
});

app.get("/home/:id", async (req, res) => {
  const noteId = req.params.id;
  if (noteId == null) res.sendStatus(404);

  const note = await notes.findById(noteId);

  res.render("oneNote", { title: note.title, content: note.body });
});

// post requests..

app.post("/home/:id", async (req, res) => {
  var noteId = req.params.id;
  const arr = await signIn.findOne({ userName: k1 });
  const arr1 = arr.NoteSchema;
  await notes.deleteOne({ _id: noteId });
  noteId = `"${noteId}"`;

  for (var i = 0; i < arr1.length; i++) {
    const str = JSON.stringify(arr1[i]._id);

    if (str === noteId) {
      //   console.log(noteId);
      break;
    }
  }
  //  console.log(i);
  await arr.NoteSchema.splice(i, 1);
  // await notes.deleteOne({_id : noteId});
  arr.save();
  res.redirect("/home");
});

// login siging requests.....

app.get("/", (req, res) => {
  res.render("base.ejs", { title: "Sign Up" });
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/home", async (req, res) => {
  const notesArray = await signIn.findOne({ userName: k1 });

  var array = notesArray.NoteSchema;

  res.render("index", { allNotes: array });
});

app.get("/incorrect", (req, res) => {
  res.render("incorrect.ejs");
});

app.get("/wrongCredentials", (req, res) => {
  res.render("already");
});

app.post("/", async (req, res) => {
  const alreadyExist = await signIn.findOne({ userName: req.body.username });

  const newdata = await new signIn({
    userName: req.body.username,
    password: req.body.password,
  });

  
  console.log(typeof(alreadyExist));
  if (alreadyExist) {
    res.redirect("/wrongCredentials");
  } else {
    newdata.save();
    res.redirect("/login");
  }
});

app.post("/login", async (req, res) => {
  loginUsername = await req.body.username;
  const loginPassword = await req.body.password;
  k1 = loginUsername;
  signIn.find((err, resp) => {
    if (err) {
      console.log(err);
    } else {
      let a = false;
      for (let i = 0; i < resp.length; i++) {
        if (
          resp[i].userName === loginUsername &&
          resp[i].password === loginPassword
        ) {
          a = true;
          break;
        }
      }

      if (!a) res.redirect("/incorrect");
      else {
        res.redirect("/home");
      }
    }
  });
});

app.post("/newNote", async (req, res) => {
  const newTitle = req.body.title;
  const newBody = req.body.textarea;

  const newData = new notes({
    title: newTitle,
    body: newBody,
  });

  await newData.save();

  const k = await signIn.findOne({ userName: k1 });
  k.NoteSchema.push(newData);
  await k.save();

  //console.log(k.NoteSchema);
  res.redirect("/home");
});

app.listen(port, () => {
  console.log(`listening to the port ${port}`);
});
