import Plan from "../models/plan.model.js";
import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

  
//CREATE PLAN FUNCTION
export const createPlan = async (req, res, next) => {
  if (req.isSeller)//Check if user is a seller
    return next(createError(403, "Only users can upload a plan!"));

  const gig = await Gig.findById(req.params.gigId);
  const newPlan = new Plan({
    userId: req.userId,
    gigId: gig._id,
    sellerId: gig.userId,
    ...req.body,
  });

  try {
    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (err) {
    next(err);
  }
};

//DELETE PLAN FUNCTION
export const deletePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id);// Get plan id
    if (plan.userId !== req.userId)// Ensure user can only delete his/her plan
      return next(createError(403, "You can delete only your plan!"));

    await Plan.findByIdAndDelete(req.params.id);
    res.status(200).send("Plan has been deleted!");
  } catch (err) {
    next(err);
  }
};

//GET PLAN FUNCTION
export const getPlan = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id);//Get plan from planId in URL
    if (!plan) next(createError(404, "Plan not found!"));
    res.status(200).send(plan);
  } catch (err) {
    next(err);
  }
};

//GET PLANS FUNCTION
export const getPlans = async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };
  try {
    const plans = await Plan.find(filters).sort({ [q.sort]: -1 });
    res.status(200).send(plans);
  } catch (err) {
    next(err);
  }
};