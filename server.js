const { urlencoded } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortURL");

const app = express();

mongoose
  .connect("mongodb://localhost:27017/urlShortener", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MongoDB Coonected...");
  })
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shorturl = await ShortUrl.find();
  res.render("index", { shorturl });
});

app.post("/shortURL", async (req, res) => {
  await ShortUrl.create({ full: req.body.FullURL });
  res.redirect("/");
});

app.get("/:shorturls", async (req, res) => {
  const shorturl = await ShortUrl.findOne({ short: req.params.shorturls });
  if (shorturl == null) return res.sendStatus(404);
  shorturl.clicks++;
  shorturl.save();
  res.redirect(shorturl.full);
});

app.post("/:delete", (req, res) => {
  ShortUrl.deleteOne({ short: req.params.delete })
    .then(() => {
      res.redirect("/");
    })
    .catch((e) => console.log(e));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running..."));
