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


module.exports = router;
