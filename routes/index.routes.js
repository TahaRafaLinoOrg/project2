const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const Project = require("../models/Project.model");
const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res, next) => {
  const loggedInUser = req.session.currentUser
  res.render("index", { loggedInUser });
});
router.get("/portfolio", (req, res, next) => {
  const loggedInUser = req.session.currentUser
  res.render("portfolio", { loggedInUser });
});
router.get("/create-project", (req, res, next) => {
  res.render("create-project");
});
router.post("/create-project", (req, res, next) => {
  console.log("require body",req.body)
  const loggedInUser = req.session.currentUser
  const { name, description, imgUrl, username } = req.body
  Project.create({ name, description, imgUrl, username: loggedInUser })
    .then((results) => {
      console.log("results1 ", results)
      
      //const loggedInUser = req.session.currentUser
      //const userId = req.body;
      const projectId = req.body;
      return User.findByIdAndUpdate(loggedInUser._id, { $push: { project: results._id } })
    })
    .then((results2) => {
      console.log("results 2",results2)
    })
    .catch((err) => next(err));
  res.render("portfolio");
});


module.exports = router;
