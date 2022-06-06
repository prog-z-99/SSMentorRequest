import { connectToDatabase } from "./mongodb";
import Request from "../models/requestModel";
import User from "../models/userModel";
import { isMentor } from "./helper";
import mongoose from "mongoose";

connectToDatabase();

export async function getAllRequests() {
  const requests = await Request.find({
    archived: { $ne: true },
  })
    .populate({ path: "mentor", model: "User" })
    .then((items) => cleaner(items));
  return requests;
}

export async function getAllMentors() {
  return await User.find({ userType: "mentor" }).then((mentors) =>
    mentors.map((mentor) => ({
      discordId: mentor.discordId,
      discordName: mentor.discordName,
      _id: mentor._id.toString(),
    }))
  );
}

export async function getMentorRequests(userId) {
  return await Request.find({ mentor: mongoose.Types.ObjectId(userId) })
    .sort({ completed: -1 })
    .then((items) => cleaner(items));
}

export async function isRequestPending(session) {
  const temp = await Request.find({
    $query: { discordId: session.user.id },
  })
    .sort({ createdAt: -1 })
    .limit(1);

  const request = temp[0];

  if (request) {
    if (!request.completed || wasMonthAgo(request.completed)) {
      return true;
    }
  }
  return false;
}

function wasMonthAgo(completed) {
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const then = new Date(completed);
  return monthAgo < then;
}

export async function getSessionUser(session) {
  return await User.findOne({ discordId: session.user.id });
}

export async function tryRegisterMentor(session) {
  const user = await getSessionUser(session);
  if (!user) {
    const newUser = new User({
      discordName: `${session.user.name}#${session.user.discriminator}`,
      discordId: session.user.id,
    });
    await newUser.save();
    return 0;
  }
  if (isMentor(user)) return 1;
  return 2;
}

function cleaner(items) {
  return items.map((item) => ({
    id: item._id.toString(),
    status: item.status,
    rank: item.rank,
    region: item.region,
    summonerName: item.summonerName || item.opgg || "what",
    role: item.role,
    champions: item.champions || null,
    timezone: item.timezone,
    info: item.info || null,
    createdAt: item.createdAt.toISOString(),
    discordName: item.discordName,
    discordId: item.discordId,
    accepted: item.accepted?.toISOString() || null,
    completed: item.completed?.toISOString() || null,
    mentor: item.mentor?.discordName || null,
    remarks: item.remarks || null,
  }));
}
