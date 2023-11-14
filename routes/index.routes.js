const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const Project = require("../models/Project.model");
const User = require("../models/User.model");

/* GET home page */
/* ONLY SHOW THE INFOMATION  IF YOUR ARE LOGIN* */


/*INDEX */
router.get("/", (req, res, next) => {
  const loggedInUser = req.session.currentUser
  res.render("index", { loggedInUser });
});

/*PORTFOLIO*/
router.get("/portfolio", (req, res, next) => {
  const loggedInUser = req.session.currentUser
  const { name, description, imgUrl, username, project } = req.body //work later in this one
  res.render("portfolio", { loggedInUser, username, project, name, description, imgUrl });
});

/*CREATE-PROJECT*/
router.get("/create-project", (req, res, next) => {
  res.render("create-project");
});
router.post("/create-project", (req, res, next) => {
  console.log("require body", req.body)
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
      console.log("results 2", results2)
    })
    .catch((err) => next(err));
  res.render("portfolio");
});

/*USER-DETAILS*/
router.get("/user-details", (req, res, next) => {
  res.render("user-details")
})
router.post("/user-details", (req, res, next) =>{
  console.log("require user",req.body)
  const loggedInUser = req.session.currentUser
    .then((profileResult) => {
      console.log("here the profile: ", profileResult)
      
      return User.findByIdAndUpdate(loggedInUser._id, { $push: { project: results._id } })
})
})


module.exports = router;
