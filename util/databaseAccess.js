import dbConnect from "./mongodb";
import mongoose from "mongoose";
mongoose.set("strictQuery", false);
dbConnect();

export async function testRequest() {
  return "Bonga";
}
