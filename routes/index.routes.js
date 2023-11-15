const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const fileUploader = require('../config/cloudinary.config');

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
  const { email, description } = req.session.currentUser
  const loggedInUser = req.session.currentUser
  console.log({ loggedInUser });
  User.findOne({ email })
    .populate("project")
    .then((userpop) => {
      //console.log("populate log:", userpop)
      console.log("This console log:", userpop.userImage)
      res.render("portfolio", { loggedInUser, arrayOfProjects: userpop.project, userpop });
    })
    .catch((err) => next(err));

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
  res.redirect("/portfolio")
});

/*USER-DETAILS*/
router.get("/user-details", (req, res, next) => {
  res.render("user-details")
})
router.post("/user-details", fileUploader.single('userImage'), (req, res, next) => {
  console.log("require user", req.body)
  const loggedInUser = req.session.currentUser
  const { userDescription, userImage } = req.body

  return User.findByIdAndUpdate(loggedInUser._id, { description: userDescription, userImage: req.file.path })
    .then((profileResult) => {
      console.log("here the profile: ", profileResult)
      res.redirect("/portfolio")
    })
    .catch((err) => next(err));
})




/*project*/

router.get("/project/:projectId", (req, res, next) => {
  const id = req.params.projectId;
  Project.findById(id)
    .then((results3) => {
      //console.log(results3)
      res.render("project", results3)
    })
    .catch((err) => next(err));
})







module.exports = router;
