import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

// CREATE GIG FUNCTION
export const createGig = async (req, res, next) => {
  if (!req.isSeller) //Check if user is not a seller
    return next(createError(403, "Only sellers can create a gig!"));

  const newGig = new Gig({
    userId: req.userId,//Get userId in using jwt
    ...req.body,
  });

  try {
    const savedGig = await newGig.save();//Save gig info to database
    res.status(201).json(savedGig);
  } catch (err) {
    next(err);
  }
};

// DELETE GIG FUNCTION
export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);// Get gig id
    if (gig.userId !== req.userId)// Ensure user can only delete his/her gig
      return next(createError(403, "You can delete only your gig!"));

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send("Gig has been deleted!");
  } catch (err) {
    next(err);
  }
};

// GET GIG FUNCTION
export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) next(createError(404, "Gig not found!"));
    res.status(200).send(gig);
  } catch (err) {
    next(err);
  }
};

// GET GIGS BASED ON SEARCH FILTERS
export const getGigs = async (req, res, next) => {
  const q = req.query;// create query object for finding objects
  const filters = {
    ...(q.userId && { userId: q.userId }),// Get all gigs belong to a userID
    ...(q.cat && { cat: q.cat }),//display gigs based on category
    ...((q.min || q.max) && {//display gigs based on min max range
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    //$regex: mongoDB regex function for Search gig title
    //$options: "i": search whether capital or simple
  };
  try {
    const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });//show the latest gigs
    res.status(200).send(gigs);
  } catch (err) {
    next(err);
  }
};