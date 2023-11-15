const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const Project = require("../models/Project.model");
const User = require("../models/User.model");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");




/*INDEX */
router.get("/", (req, res, next) => {
  const loggedInUser = req.session.currentUser
  res.render("index", { loggedInUser });
});

/*PORTFOLIO*/
router.get("/portfolio", isLoggedIn,  (req, res, next) => {
  const { email, description } = req.session.currentUser
  const loggedInUser = req.session.currentUser
  //console.log({ loggedInUser });
  User.findOne({ email })
    .populate("project")
    .then((userpop) => {
      //console.log("populate log:", userpop)
      //console.log("This console log:", userpop.userImage)
      res.render("portfolio", { loggedInUser, arrayOfProjects: userpop.project, userpop });
    })
    .catch((err) => next(err));
    /* this part we trying to work */

});

/*CREATE-PROJECT*/
router.get("/create-project", (req, res, next) => {
  res.render("create-project");
});
router.post("/create-project", (req, res, next) => {
  //console.log("require body", req.body)
  const loggedInUser = req.session.currentUser
  const { name, description, imgUrl, username } = req.body
  Project.create({ name, description, imgUrl, username: loggedInUser })
    .then((results) => {
      //console.log("results1 ", results)

      //const loggedInUser = req.session.currentUser
      //const userId = req.body;

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
  const userInformation = req.session
  console.log(userInformation)
  res.render("user-details", {userInformation})
})
router.post("/user-details", (req, res, next) => {
  //console.log("require user", req.body)
  const loggedInUser = req.session.currentUser
  const { userDescription, userImage } = req.body

  return User.findByIdAndUpdate(loggedInUser._id, { description: userDescription, userImage: userImage })
    .then((profileResult) => {
      //console.log("here the profile: ", profileResult)
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

/*project Edit*/

router.get("/edit-project/:_id", (req, res, next) => {
  const projectId = req.params._id
  //const userInformation = req.session
  Project.findById(projectId)
  .then((thisProject)=>{
    //console.log("hola aca esa el req.params",req)
    res.render("edit-project", {projectId,thisProject})
  })
  
})

router.post("/edit-project/:_id", (req, res, next) => {
  const projectId = req.params._id;
  const { name, description, imgUrl } = req.body
  return Project.findByIdAndUpdate(projectId, { name, description, imgUrl })
    .then((projectResult) => {
      //console.log("PROJECT RESULT", projectResult)
      res.redirect("/portfolio")
    })
    .catch((err) => next(err))
})
 /*DELETE-PROJECT */
router.get("/delete-project/:_id", (req, res, next) =>{
  const projectId = req.params._id
  console.log("reading");
  res.render("delete-project", {projectId})
})
router.post("/delete-project/:_id", (req, res, next) => {
  const projectId = req.params._id;
  console.log("working?");
  return Project.deleteOne({_id: projectId})
    .then((projectDelete) => {
      console.log("PROJECT DELETE RESULT", projectDelete)
      res.redirect("/portfolio")
    })
    .catch((err) => next("this a error", err))
})

/*RELATIONSHIP BETWEEN USERS */
router.get("/find-users", (req,res,next) =>{
  console.log("this working");
  res.render("find-users")
})
router.post("/find-users", (req, res, next) => {
  console.log("what about this");
  const { searchUsers } = req.body
  return User.find({username: searchUsers})
    .then((findUser) => {
      console.log("the user is: ", findUser)
      res.render("find-users", {findUser})
    })
    .catch((err) => next("this a error", err))
})



module.exports = router;
