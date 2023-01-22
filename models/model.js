const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema( {
    title : {
        type : String,
        
    },
    body : {
        type : String,
        
    }
})

const userName = new Schema({
    userName: String,
    password: String,
    NoteSchema : [] 
});

const signIn = mongoose.model("signin", userName);
const notes = mongoose.model("note", noteSchema);

module.exports = {signIn,notes};