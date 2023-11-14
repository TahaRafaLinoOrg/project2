const mongoose = require("mongoose");

const Schema = mongoose.Schema;


// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    
    userImage: {
      type: String,
      default: "Your image here!",
    },
    
    description : {
      type: String,
      default: "Your description here!",
    },
    
    project: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  },
  
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
