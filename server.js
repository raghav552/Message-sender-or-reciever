const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use("/audio", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".webm");
  },
});

const upload = multer({ storage });

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

  res.json({
    message: "Message received",
    file: audio
  });

});

/* GET MESSAGES FOR INBOX */
app.get("/messages/:slug", (req, res) => {

  const slug = req.params.slug;

  const pageMessages = messages.filter(m => m.slug === slug);

  res.json(pageMessages);

});

/* RECORDING PAGE */
app.get("/r/:slug", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* INBOX PAGE */
app.get("/inbox/:slug", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "inbox.html"));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});