import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    discordId: {
      type: String,
      required: true,
    },
    discordName: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
