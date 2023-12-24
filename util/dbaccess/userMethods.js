import Request from "../../models/requestModel";
import User from "../../models/userModel";
import { ObjectId } from "mongodb";
import {
  checkAdmin,
  checkMentor,
  checkReviewer,
  checkStaff,
  getCleanedDiscordUser,
  getMonthsAgo,
} from "../helper";
import { getLatestDiscordProfile } from "./discordMethods";
import mongoose from "mongoose";
import dbConnect from "../mongodb";
mongoose.set("strictQuery", false);
dbConnect();

export const getAllUsers = async () => {
  const users = await User.find()
    .collation({ locale: "en" })
    .sort("discordName")
    .lean();

  const data = await Promise.all(
    users.map(async (user) => ({
      ...(await getLatestRequestInteractions(user)),
      ...user,
    }))
  );

  return data;
};

export const getAllMentors = async () => {
  const mentors = await User.find({
    $or: [{ isMentor: true }],
  })
    .collation({ locale: "en" })
    .sort("discordName")
    .lean();

  return mentors;
};

export const getUserById = async (id) => {
  return await User.findOne({ discordId: id })
    .select("-__v -createdAt -updatedAt")
    .lean();
};

export async function getUsersById(ids) {
  const users = await User.find({ discordId: { $in: ids } })
    .lean()
    .select("discordName discordId");

  return users;
}

export const getLatestRequestInteractions = async (mentor) => {
  const threeMonthsAgo = getMonthsAgo(3);
  const lastTaken = await Request.findOne({ mentor: mentor._id }).sort({
    accepted: -1,
  });

  if (!lastTaken) return {};

  const fetchTakenPeriod = Request.countDocuments({
    mentor: mentor._id,
    accepted: { $gt: threeMonthsAgo },
  });

  const fetchCompletedPeriod = Request.countDocuments({
    mentor: mentor._id,
    status: "Completed",
    completed: { $gt: threeMonthsAgo },
  });

  const fetchLastCompleted = Request.findOne({
    mentor: mentor._id,
    status: "Completed",
  }).sort({ completed: -1 });

  return {
    lastTaken: lastTaken.accepted,
    lastCompleted: (await fetchLastCompleted)?.completed,
    takenPeriod: await fetchTakenPeriod,
    completedPeriod: await fetchCompletedPeriod,
  };
};

export async function tryRegisterMentor(user) {
  const registeredUser = await getUserById(user.discordId);
  if (registeredUser) {
    return registeredUser;
  }
  const newUser = new User({
    ...user,
    isTrial: true,
  });
  return await newUser.save();
}

export async function editUser(body) {
  const { userId, command } = body;
  const user = await User.findById(userId);
  switch (command) {
    case "SET_TRIAL":
      user.isTrial = body.bool;
      break;
    case "SET_MENTOR":
      user.isTrial = false;
      user.isMentor = body.bool;
      break;
    case "SET_ADMIN":
      user.isAdmin = body.bool;
      break;
    case "SET_REVIEWER":
      user.isReviewer = body.bool;
      break;
    case "SET_PEAKRANK":
      user.peakRank = body.rank;
      break;
    case "SET_CHAMPIONS":
      user.bestChampions = body.value;
      break;
    case "SET_REGION":
      user.mentorRegion = body.value;
      break;
    case "SET_ROLES":
      user.preferredRoles = body.value;
  }
  await user.save();
  return `Sucessfully edited to ${command}`;
}

export async function deleteUser(user) {
  try {
    const response = await User.deleteOne({ _id: ObjectId(user) });
    console.log(response);
    return "User deletion success!";
  } catch {
    return "Error trying to delete user";
  }
}

export async function isUserAdmin(id) {
  const user = await getUserById(id);
  return checkAdmin(user);
}

export async function isUserMentor(id) {
  return checkMentor(await getUserById(id));
}

export async function isUserStaff(id) {
  return checkStaff(await getUserById(id));
}

export async function isUserReviewer(id) {
  return checkReviewer(await getUserById(id));
}

export const updateAllUserDiscordDetail = async () => {
  //Need timer because discord has 50 request per second limit on APIs.
  //Currently not in any API route. Might be good to set it somewhere.
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  const users = await User.find();

  for (const user of users) {
    await timer(10);
    const currentDiscord = await getLatestDiscordProfile(user.discordId);
    if (getCleanedDiscordUser(currentDiscord) != user.discordName) {
      user.discordName = getCleanedDiscordUser(currentDiscord);
      user.save();
    }
  }
};
