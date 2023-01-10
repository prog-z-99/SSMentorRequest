import mongoose from "mongoose";
import { userType } from "../util/datalist";

const userSchema = mongoose.Schema(
  {
    discordId: {
      type: String,
      required: true,
      unique: true,
    },
    discordName: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: userType,
      default: "user",
    },
    isMentorReviewer: {
      type: Boolean,
      default: false,
    },
    isMentor: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose?.models?.User || mongoose.model("User", userSchema);
