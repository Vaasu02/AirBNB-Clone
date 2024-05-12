const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  reviewvalidation,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewControllers = require("../controllers/review.js");

//reviews
//post method
router.post(
  "/",
  isLoggedIn,
  reviewvalidation,
  wrapAsync(reviewControllers.createReview)
);

//deletereviews
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewControllers.deleteReview)
);

module.exports = router;
