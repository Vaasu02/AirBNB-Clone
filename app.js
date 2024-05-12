
if(process.env.NODE_ENV != "production"){
  require('dotenv').config();  
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');


const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const passport=require('passport');
const localStrategy=require('passport-local');
const User=require('./models/user.js')

app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const dbURL=process.env.ATLASDB_URL;

// const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbURL);
}

const store=MongoStore.create({
  mongoUrl:dbURL,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*60*60,
});

store.on("error",()=>{
  console.log("Eror in monfo session store",err);
})


app.use(session({
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge:1000 * 60 * 60 * 24 * 7
  }
}))


app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash message
app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  res.locals.currUser=req.user;
  
  next();
})

// app.get('/demouser',async(req,res)=>{
//   let fakeUser=new User({
//     email:"newuser@gmail.com",
//     username:"Student"
//   });

//   let registeredUser=await User.register(fakeUser,"dfgh");
//   res.send(registeredUser);
// })

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use('/',userRouter);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "ssomething Went Wrong" } = err;
  res.status(status).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
