const Listing = require("./models/listing");
const { listingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema}=require('./schema.js');
const Review = require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req.path," ",req.orginalUrl);
    
    if(!req.isAuthenticated()){

        req.session.redirectUrl=req.originalUrl;
        req.flash('error','You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.savRredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash('error','Only Listings Owners have the permission to do Changes');
        return res.redirect(`/listings/${id}`);
    }

    next();

}

module.exports.isReviewAuthor= async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
      req.flash('error','Only Review Owners have the permission to do Changes');
      return res.redirect(`/listings/${id}`);
  }

  next();

}

module.exports.validatelistings = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
  
    if (error) {
      let errmsg = error.details.map((el) => el.message).join(",");
  
      throw new ExpressError(400, errmsg);
    } else {
      next();
    }
  };
  

module.exports.reviewvalidation=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    
    if(error){
      let errmsg=error.details.map(el=>el.message).join(',');
      
      throw new ExpressError(400, errmsg);
    }else{
      next();
    }
  }
  
