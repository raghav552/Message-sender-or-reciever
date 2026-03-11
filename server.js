const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://rahulraghav0537_db_user:ZLNOMzBQuZmwt8KC@cluster0.qewvqgn.mongodb.net/?appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));



const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/r/:slug", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/inbox/:slug", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "inbox.html"));
});

app.use(express.static("public"));
app.use("/audio", express.static("uploads"));

/* STORAGE FOR AUDIO FILES */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".webm");
  }
});

const upload = multer({ storage });

/* TEMP MESSAGE STORAGE */
let messages = [];

/* SEND MESSAGE */
app.post("/send-message/:slug", upload.single("audio"), (req, res) => {

  const slug = req.params.slug;
  const name = req.body.name || "Anonymous";
  const audio = req.file.filename;

  const message = {
    slug: slug,
    name: name,
    audio: audio
  };

  messages.push(message);

  console.log("New message:", message);

  res.json({
    success: true,
    file: audio
  });

});

/* GET MESSAGES */
app.get("/messages/:slug", (req, res) => {

  const slug = req.params.slug;

  const pageMessages = messages.filter(m => m.slug === slug);

  res.json(pageMessages);

});

/* MESSAGE PAGE */
app.get("/r/:slug", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* INBOX PAGE */
app.get("/inbox/:slug", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "inbox.html"));
});
// route for home page
app.get("/", (req,res)=>{
  res.sendFile(path.join(__dirname,"public","home.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});