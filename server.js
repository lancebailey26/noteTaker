// dependencies
const express = require('express');
const path = require('path');
const fs = require("fs");
const data = fs.readFileSync("./db/db.json", "utf-8");
const noteList = JSON.parse(data);
//uuidv4 needed to give each note an id
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// routes
//this is needed to force the css to load
app.get("/assets/css/styles.css", (req, res) => {
  res.set("content-type", "text/css");
  res.sendFile(path.join(__dirname, "/assets/css/styles.css"));
});
//this is needed to force the javascript to load
app.get("/assets/js/index.js", (req, res) =>
  res.sendFile(path.join(__dirname, "/assets/js/index.js"))
);
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'notes.html')));
app.get("/api/notes", (req, res) => {
    res.set("content-type", "application/json");
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

//writes notes to db
function noteWriter(notes) {
    fs.writeFile(
      path.join(__dirname, "/db/db.json"),
      JSON.stringify(notes),
      (err) => (err ? console.err(err) : console.log("note saved to db"))
    );
};
// writes new note and gives it an id with uuidv4
app.post("/api/notes", (req, res) => {
    const note = req.body;
    const noteID = uuidv4();
    note.id = noteID;
    noteList.push(note);
    noteWriter(noteList);
    res.send(note);
  });
//delete note if id number matches
  app.delete("/api/notes/:uuid", (req, res) =>{
    for(let i = 0; i < noteList.length; i++){
      if (noteList[i].id === req.params.uuid){
        noteList.splice(i, 1);
      } 
    }
    noteWriter(noteList);
    res.end();
  });
//listener
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));