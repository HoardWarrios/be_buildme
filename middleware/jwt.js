import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;//Request cookie/access token
  if (!token) return next(createError(401,"You are not authenticated!"))


  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => { //verify JWT (check token validity) return 'payload':infomation
    if (err) return next(createError(403,"Token is not valid!"))
    req.userId = payload.id; // reqest user information for the ID
    req.isSeller = payload.isSeller; // reqest seller information 
    next()// After JWT verification goes to next function 
  });
};