import mongoose from "mongoose";
import { ranks, regions, statuses } from "../util/datalist";

const requestSchema = mongoose.Schema(
  {
    division: {
      type: String,
      required: true,
      enum: ranks,
    },
    rank: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    },
    opgg: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    champions: {
      type: Number,
      required: true,
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
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    link: {
      type: String,
      required: false,
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

const Request = mongoose.model("Request", requestSchema);

export default Request;
