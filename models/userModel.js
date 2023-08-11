import mongoose from "mongoose";
import { regions } from "../util/datalist";

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
    discordDisplayName: {
      type: String,
    },
    userType: {
      type: String,
    },
    isReviewer: {
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
    isTrial: {
      type: Boolean,
      default: false,
    },
    bestChampions: {
      type: [String],
      default: [],
    },
    preferredRoles: {
      type: [String],
      default: [],
    },
    peakRank: {
      type: String,
    },
    mentorRegion: {
      type: String,
      enum: regions,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose?.models?.User || mongoose.model("User", userSchema);
