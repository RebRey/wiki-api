// Required modules
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");

// Create the app and port connection
const app = express();
const port = 3000;
app.listen(port, function () {
  console.log("Server is running on port " + port + ".");
});

// Set ejs
app.set("view engine", "ejs");

// Use body-parser and express in the app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Open the connection to MongoDB Atlas and create the database
main().catch((err) => console.log(err));
async function main() {
  mongoose.set("strictQuery", false);
  // Create a connection string for Mongo Atlas
  const connectionURI =
    "mongodb+srv://admin-rebecca:" +
    process.env.MONGO_ATLAS_ADMIN_PASSWORD +
    "@cluster0.swlgzsc.mongodb.net/wikiDB";
  // Mongo Atlas connection
  await mongoose.connect(connectionURI);

  console.log("Connected to MongoDB server.");
}

// Create a Mongoose Schema that contains a title and content.
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

// Create a Mongoose Model using the articleSchema to define your Articles Collection
const Article = mongoose.model("Article", articleSchema);

// **** REQUESTS TARGETING ALL ARTICLES ****
// Chained Route Handlers Using Express
app
  .route("/articles")
  // Handle GET request for the article route
  .get(function (req, res) {
    // Query database and find all documents in the Articles Collection
    Article.find(function (err, foundArticles) {
      // If no errors are found, render the foundArticles
      if (!err) {
        res.send(foundArticles);
      } else {
        // otherwise send an HTTP error response
        res.send(err);
      }
    });
  })
  // Handle the POST request for the article route
  .post(function (req, res) {
    // Create a Mongoose Document to save a new article in MongoDB
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    // save newArticle on MongoDB and use call back function inside save method to handle errors
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })
  // Handle DELETE request to delete ALL articles in the articles route
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted ALL articles.");
      } else {
        res.send(err);
      }
    });
  });

// **** REQUESTS TARGETING A SPECIFIC ARTICLE ****
// Get a specific article
app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles matching that title was found.");
        }
      }
    );
  })

  .put(function(req,res){
    Article.replaceOne(
        {title : req.params.articleTitle},
        {title : req.body.title, content: req.body.content },
 
        function(err){
            if(!err){
                res.send("Successfully updated article.");
            }else {
                res.send(err)
            }
        }
    )
});
