import MentorApp from "../models/mentorAppModel";
import dbConnect from "./mongodb";
import mongoose from "mongoose";

mongoose.set("strictQuery", false);
dbConnect();

export async function testRequest() {
  // appsReset();
  return "Bonga";
}

export async function appsReset() {
  console.log(
    await MentorApp.updateMany({ processed: true }, { appStatus: "processed" })
  );
  console.log(
    await MentorApp.updateMany({ processed: false }, { appStatus: "pending" })
  );
}
