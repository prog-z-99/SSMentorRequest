import mongoose from "mongoose";
import { regions, roles, statuses } from "../util/datalist";

const CommentSchema = mongoose.Schema(
  {
    commenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const requestSchema = mongoose.Schema(
  {
    discordId: {
      type: String,
      required: true,
    },
    discordName: {
      type: String,
      required: true,
    },
    rank: {
      type: String,
      required: true,
      // enum: ranks, FIX LATER
    },
    summonerName: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: roles,
    },
    champions: {
      type: [String],
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
    interactedMentors: [
      {
        mentor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        action: { type: String },
        date: { type: Date },
      },
    ],
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
    archived: {
      type: Boolean,
      default: false,
    },
    comments: [CommentSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose?.models?.Request ||
  mongoose.model("Request", requestSchema);
