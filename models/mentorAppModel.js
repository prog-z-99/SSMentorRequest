import mongoose from "mongoose";
import { ranks, regions } from "../util/datalist";

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
      type: string,
      default: "Iron",
      enum: ranks,
    },
    appReason: {
      type: String,
    },
    matchupEx: {
      type: String,
    },
    rebuttalEx: {
      type: String,
    },
    experience: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose?.models?.MentorApp ||
  mongoose.model("MentorApp", MentorAppSchema);
