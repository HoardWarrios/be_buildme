// import mongoose from "mongoose";
// const { Schema } = mongoose;

// const userSchema = new Schema({
// username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   img: {
//     type: String,
//     required: false,
//   },
//   city: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: String,
//     required: false,
//   },
//   desc: {
//     type: String,
//     required: false,
//   },
//   isSeller: {
//     type: Boolean,
//     default:false
//   },
// },{
//   timestamps:true
// });

// export default mongoose.model("User", userSchema)

// ;
//PREVIOUS CODE COMMENTED
import mongoose from "mongoose"; // Ensure mongoose is imported

const { Schema } = mongoose; // Destructure Schema from mongoose

// Define the schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: false,
  },
  additionalImg: { // Added field for the second image
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },
  isSeller: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Export the model
export default mongoose.model("User", userSchema);

