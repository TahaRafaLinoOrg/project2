const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  const loggedInUser = req.session.currentUser
  res.render("index", {loggedInUser});
});
router.get("/portfolio", (req, res, next) => {
  const loggedInUser = req.session.currentUser
  res.render("portfolio", {loggedInUser});
});
router.get("/create-project", (req, res, next) => {
  res.render("create-project");
});
router.post("/create-project", (req, res, next) => {
  console.log(req.body)
  //const {name, description, img} = req.body
  
  Project.create()
  res.render("create-project", {loggedInUser});
});


module.exports = router;
