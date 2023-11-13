const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const Project = require("../models/Project.model");

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
  const {name, description, img} = req.body
    .then((results1)=>{
      return Project.create({ name, description, password: hashedPassword });
    })
  //im here
  
  //Project.create()
  res.render("portfolio");
});


module.exports = router;
