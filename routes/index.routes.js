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
router.get("/portfolio", isLoggedIn, (req, res, next) => {
  const { email, description } = req.session.currentUser
  const loggedInUser = req.session.currentUser
  User.findOne({ email })
    .populate("project")
    .then((userpop) => {
      res.render("portfolio", { loggedInUser, arrayOfProjects: userpop.project, userpop });
    })
    .catch((err) => next(err));

});

/*CREATE-PROJECT*/
router.get("/create-project", isLoggedIn, (req, res, next) => {
  const loggedInUser = req.session.currentUser
  res.render("create-project", { loggedInUser });
});
router.post("/create-project", (req, res, next) => {
  const loggedInUser = req.session.currentUser
  const { name, description, imgUrl, username } = req.body
  Project.create({ name, description, imgUrl, username: loggedInUser })
    .then((results) => {
      return User.findByIdAndUpdate(loggedInUser._id, { $push: { project: results._id } })
    })
    .then((results2) => {
      console.log("results 2", results2)
    })
    .catch((err) => next(err));
  res.redirect("/portfolio")
});

/*USER-DETAILS*/
router.get("/user-details", isLoggedIn, (req, res, next) => {
  const userInformation = req.session
  const loggedInUser = req.session.currentUser
  console.log(userInformation)
  res.render("user-details", { userInformation, loggedInUser })
})
router.post("/user-details", (req, res, next) => {
  const loggedInUser = req.session.currentUser
  const { userDescription, userImage } = req.body

  return User.findByIdAndUpdate(loggedInUser._id, { description: userDescription, userImage: userImage })
    .then((profileResult) => {
      res.redirect("/portfolio")
    })
    .catch((err) => next(err));
})


/*project*/

router.get("/project/:projectId", isLoggedIn, (req, res, next) => {
  const id = req.params.projectId;
  const loggedInUser = req.session.currentUser
  Project.findById(id)
    .then((results3) => {
      const results3Username = results3.username;
      const results3UsernameString = results3Username.toString();
      let match = false
      if (loggedInUser._id == results3UsernameString) {
        let match = true
        res.render("project", { results3, loggedInUser, match })
      } else {
        console.log(match)
        res.render("project", { results3, loggedInUser })
      }
    })
    .catch((err) => next(err));
})

/*project Edit*/

router.get("/edit-project/:_id", isLoggedIn, (req, res, next) => {
  const loggedInUser = req.session.currentUser
  const projectId = req.params._id
  Project.findById(projectId)
    .then((thisProject) => {
      res.render("edit-project", { projectId, thisProject, loggedInUser })
    })

})

router.post("/edit-project/:_id", (req, res, next) => {
  const projectId = req.params._id;
  const { name, description, imgUrl } = req.body
  return Project.findByIdAndUpdate(projectId, { name, description, imgUrl })
    .then((projectResult) => {
      res.redirect("/portfolio")
    })
    .catch((err) => next(err))
})
/*DELETE-PROJECT */
router.get("/delete-project/:_id", isLoggedIn, (req, res, next) => {
  const loggedInUser = req.session.currentUser
  const projectId = req.params._id
  res.render("delete-project", { projectId, loggedInUser })
})
router.post("/delete-project/:_id", (req, res, next) => {
  const projectId = req.params._id;
  console.log("working?");
  return Project.deleteOne({ _id: projectId })
    .then((projectDelete) => {
      res.redirect("/portfolio")
    })
    .catch((err) => next("this a error", err))
})

/*FIND OTHER USERS */
router.get("/find-users", isLoggedIn, (req, res, next) => {
  const loggedInUser = req.session.currentUser
  console.log("this working");
  res.render("find-users", { loggedInUser })
})
router.post("/find-users", (req, res, next) => {
  const { searchUsers } = req.body
  const loggedInUser = req.session.currentUser
  const regexPattern = new RegExp(searchUsers, 'i');
  User.findOne({ username: { $regex: regexPattern } })
    .populate("project")
    .then((findUser) => {
      console.log("the user is finduser: ", findUser)
      const arrayOfProjects2 = findUser.project
      res.render("find-users", { findUser, arrayOfProjects2, loggedInUser })
    })
    .catch((err) => next("this a error", err))
})



module.exports = router;
