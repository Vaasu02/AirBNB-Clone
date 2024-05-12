const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validatelistings } = require("../middleware.js");
const multer=require('multer')
const {storage}=require('../cloudConfig.js')
const upload=multer({storage})

const listingControllers = require("../controllers/listing.js");

router
  .route("/")
  .get(
    //index route

    wrapAsync(listingControllers.index)
  )
  .post(
    //create route
    isLoggedIn,
    
    upload.single('listing[image]'),
    validatelistings,
    wrapAsync(listingControllers.PostnewListing)
  );
  
//new route
router.get("/new", isLoggedIn, listingControllers.rendernewlistingForm);

router
  .route("/:id")
  .get(wrapAsync(listingControllers.showlistingdetails)) //show route
  .put(
    //update route

    isLoggedIn,
    upload.single('listing[image]'),
    isOwner,
    validatelistings,
    wrapAsync(listingControllers.updateListings)
  )
  .delete(
    //delete route

    isLoggedIn,
    isOwner,
    wrapAsync(listingControllers.DeleteListing)
  );

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.editListing)
);

module.exports = router;
