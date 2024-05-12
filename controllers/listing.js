const Listing=require('../models/listing')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.rendernewlistingForm= (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.showlistingdetails=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",
      populate:{
        path:"author"
      }
    }).populate("owner");
    if(!listing){
      req.flash('error','Listing not found');
      return res.redirect('/listings');
    
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
  }

  module.exports.PostnewListing=async (req, res, next) => {
    let response=await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
      .send()
    
    
    
    
    
    
    let url=req.file.path;
    let filename=req.file.filename;

    let newListingdata = req.body.listing;
    let newlist = new Listing(newListingdata);
    newlist.owner=req.user._id;
    newlist.image={url,filename};
    newlist.geometry=response.body.features[0].geometry
    let savedlisting=await newlist.save();
    console.log(savedlisting);
    req.flash('success','New Listing created');

    // console.log(newListingdata);
    res.redirect("/listings");
  }

  module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
      req.flash('error','Listing you tryna edit does not exist dawg so get lost');
      return res.redirect('/listings');
    
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("./listings/edit.ejs", { listing,originalImageUrl});
  }

module.exports.updateListings=async (req, res) => {
    let { id } = req.params;
    

    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();

    }

    req.flash('success','Listing updated');
    res.redirect(`/listings/${id}`);
  }

  module.exports.DeleteListing=async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    req.flash('success','Listing deleted');
    console.log(deletedlisting);
    res.redirect("/listings");
  }