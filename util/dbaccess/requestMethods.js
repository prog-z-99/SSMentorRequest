import mongoose from "mongoose";
import Request from "../../models/requestModel";
import dbConnect from "../mongodb";

mongoose.set("strictQuery", false);
dbConnect();

export async function deleteRequest(id) {
  const state = await Request.findByIdAndDelete(id);
  console.log(state);
}

export async function createRequest({ values, user }) {
  const pending = isRequestPending(user);
  if (pending) throw Error;
  const request = new Request({
    ...values,
    discordName: `${user.name}#${user.discriminator}`,
    discordId: user.sub,
  });
  return await request.save();
}

export async function isRequestPending(id) {
  const request = await Request.findOne({
    discordId: id,
  }).sort({ createdAt: -1 });

  if (
    request &&
    !request?.archived &&
    (!request.completed || wasMonthAgo(request.completed))
  ) {
    return true;
  }

  return false;
}

function wasMonthAgo(completed) {
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const then = new Date(completed);
  return monthAgo < then;
}
