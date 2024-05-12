
const User=require('../models/user')


module.exports.logOut= (req, res, next) => {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You are Successfully Logged Out");
      res.redirect("/listings");
    });
  }


module.exports.Login=async (req, res) => {
    req.flash("success", "Welcome back!");
    // if (req.session.returnTo) {
    //   res.redirect(req.session.returnTo);
    // } else {
    //   res.redirect("/listings");
    // }
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    
  }

module.exports.renderUserLoginForm=(req, res) => {
    res.render("users/login.ejs");
  }


module.exports.renderSignUpform= (req, res) => {
    res.render("users/signUp.ejs");
  }


module.exports.UsersignUp=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registereduser = await User.register(newUser, password);
      console.log(registereduser);
      //to automaticallly login after a ew user signedUP
      req.login(registereduser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to airbnb");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }