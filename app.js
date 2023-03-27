require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const Post = mongoose.model('Post', postSchema);

app.get("/", (req, res) => {
  Post.find({}, (err, foundlist) => {
    if (!err) {
      res.render("index", { paraOne: foundlist });
    }
  })
})

app.get("/about", (req, res) => {
  res.render("about")
})

app.get("/contact", (req, res) => {
  res.render("contact")
})

app.get("/compose", (req, res) => {
  res.render("compose")
})

app.post("/compose", async(req, res) => {

  const postTitle = req.body.title;
  const postDescription = req.body.description;

  if (postTitle === "" || postDescription === "") {
    res.redirect('/');
  } else {
    let post = new Post({
      title: postTitle,
      description: postDescription
    });

    await post.save();
    res.redirect("/");
  }
})

app.get("/posts/:_id", (req, res) => {
  const custID = req.params._id;

  Post.findOne({ _id: custID }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        res.render("post", { title: "Not Found", description: "" })
      } else {
        res.render("post", { title: foundList.title, description: foundList.description })
      }
    }
  })

});



app.listen(3000, function () {
  console.log(`Server started on port http://localhost:3000`);
});

