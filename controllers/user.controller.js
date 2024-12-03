// import User from "../models/user.model.js";
// import createError from "../utils/createError.js";

// export const deleteUser = async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   if (req.userId !== user._id.toString()) {
//     return next(createError(403, "You can delete only your account!"));
//   }
//   await User.findByIdAndDelete(req.params.id);
//   res.status(200).send("deleted.");
// };
// export const getUser = async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   res.status(200).send(user);
// };


//PREVIOUS CODE COMMENTED
import User from "../models/user.model.js";
import createError from "../utils/createError.js";

// Get a User by ID
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(404, "User not found!"));
    }
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

// Delete a User by ID
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(404, "User not found!"));
    }
    if (req.userId !== user._id.toString()) {
      return next(createError(403, "You can delete only your account!"));
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("User deleted.");
  } catch (err) {
    next(err);
  }
};

// Update a User by ID
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(404, "User not found!"));
    }
    if (req.userId !== user._id.toString()) {
      return next(createError(403, "You can update only your account!"));
    }

    // Update user fields
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Accepts new data including additionalImg
      { new: true } // Returns updated document
    );
    res.status(200).send(updatedUser);
  } catch (err) {
    next(err);
  }
};
export const register = async (req, res, next) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create the user
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, isSeller: newUser.isSeller },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send the token and user data to the client
    const { password, ...userDetails } = newUser._doc; // Exclude password from response
    res.status(201).json({ token, userDetails });
  } catch (err) {
    next(err);
  }
};