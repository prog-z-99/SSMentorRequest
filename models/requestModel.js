import mongoose from "mongoose";
import { ranks, regions, roles, statuses } from "../util/datalist";

const requestSchema = mongoose.Schema(
  {
    discordId: {
      type: String,
      required: true,
      unique: false,
    },
    discordName: {
      type: String,
      required: true,
    },
    rank: {
      type: String,
      required: true,
      enum: ranks,
    },
    opgg: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: roles,
    },
    champions: {
      type: String,
    },
    timezone: {
      type: String,
      required: true,
    },
    info: {
      type: String,
    },
    region: {
      type: String,
      enum: regions,
      required: true,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: statuses,
      default: "Not Accepted",
    },
    accepted: {
      type: Date,
      required: false,
    },
    completed: {
      type: Date,
      required: false,
    },
    remarks: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Request ||
  mongoose.model("Request", requestSchema);
