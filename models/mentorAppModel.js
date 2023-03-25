import mongoose from "mongoose";
import { regions } from "../util/datalist";

const MentorAppSchema = mongoose.Schema(
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
    summonerName: {
      type: String,
    },
    region: {
      type: String,
      enum: regions,
    },
    rank: {
      type: String,
      default: "Iron 4",
    },
    appReason: {
      type: String,
    },
    winConEx: {
      type: String,
    },
    loseMatchupEx: {
      type: String,
    },
    rebuttalEx: {
      type: String,
    },
    experience: {
      type: String,
    },
    yay: {
      type: [String],
      default: [],
    },
    nay: {
      type: [String],
      default: [],
    },
    meh: {
      type: [String],
      default: [],
    },
    processed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose?.models?.MentorApp ||
  mongoose.model("MentorApp", MentorAppSchema);
