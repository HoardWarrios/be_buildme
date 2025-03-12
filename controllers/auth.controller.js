import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTRATION FUNCTION
export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 5);// Hashing the password 5:salt
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(201).send("User has been created.");
  } catch (err) {
    next(err);
  }
};

// LOGIN FUNCTION
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);//compare user password
    if (!isCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign( // User JWT in as a .sign function of user
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY
    );

    const { password, ...info } = user._doc;
    res // send the token using cookie as "accessToken"
      .cookie("accessToken", token, {
        httpOnly: true,// Ensure data can be changed only using http requests
      })
      .status(200)
      .send(info);
  } catch (err) {
    next(err);
  }
};

//RESET PASSWORD FUNCTION
export const resetPassword = async (req, res, next) => {
  try {

    const { username, password, confirmPassword } = req.body;

    //Get both password fields
    if (!password || !confirmPassword) {
      return next(createError(400, "Both password fields are required!"));
    }
  //Compare both passwords
    if (password !== confirmPassword) {
      return next(createError(400, "Passwords do not match!"));
    }

    const user = await User.findOne({ username });

    //Check whether user exists
    if (!user) return next(createError(404, "User not found!"));

    //hash the password
    const hash = bcrypt.hashSync(password, 5);
    user.password = hash;
    await user.save();//upadate the password

    res.status(200).send("Password has been reset successfully.");
  } catch (err) {
    next(err);
  }
};


//LOGOUT FUNCTION
export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",//Ensure cookie clearing happens not in both local 8800 & 5173 only in one
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};