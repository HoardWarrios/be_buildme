import Plan from "../models/plan.model.js";
import createError from "../utils/createError.js";

export const createPlan = async (req, res, next) => {
  if (req.isSeller)
    return next(createError(403, "Only users can upload a plan!"));

  const newPlan = new Plan({
    userId: req.userId,
    ...req.body,
  });

  try {
    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (err) {
    next(err);
  }
};
export const deletePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (plan.userId !== req.userId)
      return next(createError(403, "You can delete only your plan!"));

    await Plan.findByIdAndDelete(req.params.id);
    res.status(200).send("Plan has been deleted!");
  } catch (err) {
    next(err);
  }
};
export const getPlan = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) next(createError(404, "Plan not found!"));
    res.status(200).send(plan);
  } catch (err) {
    next(err);
  }
};
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