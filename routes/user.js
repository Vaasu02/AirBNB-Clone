const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const router = express.Router();
const passport = require("passport");
const { savRredirectUrl } = require("../middleware.js");
const userControllers = require("../controllers/users.js");

router
  .route("/signup")
  .get(userControllers.renderSignUpform)
  .post(wrapAsync(userControllers.UsersignUp));

router
  .route("/login")
  .get(userControllers.renderUserLoginForm)
  .post(
    savRredirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userControllers.Login
  );

router.get("/logout", userControllers.logOut);

module.exports = router;
