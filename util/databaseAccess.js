import dbConnect from "./mongodb";
import Request from "../models/requestModel";
import User from "../models/userModel";
import {
  checkAdmin,
  checkMentor,
  checkReviewer,
  checkStaff,
  cleaner,
  singleCleaner,
} from "./helper";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
// import { getLatestProfile, sendDMToUser } from "./dbaccess/discordMethods";

mongoose.set("strictQuery", false);
dbConnect();

export async function testRequest() {
  return "Bonga";
}

export async function requestFunctions(func) {
  return func
    .select("-interactedMentors -__v -updatedAt")
    .populate({
      path: "mentor",
      model: "User",
      select: "discordName discordId",
    })
    .sort({ createdAt: 1 })
    .lean();
}

export async function getAllRequests() {
  const now = new Date();
  const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
  const yearAgo = new Date(now.setMonth(now.getMonth() - 9));
  const requests = await requestFunctions(
    Request.find({
      archived: { $ne: true },
      $or: [
        {
          $and: [
            { status: "Completed" },
            {
              completed: { $gte: threeMonthsAgo },
            },
          ],
        },
        {
          $and: [
            { status: "Problem" },
            {
              $or: [
                {
                  completed: { $gte: threeMonthsAgo },
                  createdAt: { $gte: yearAgo },
                },
              ],
            },
          ],
        },
        { status: { $nin: ["Completed", "Problem"] } },
      ],
    })
  );
  return requests;
}

export async function getTypeRequests(status) {
  const requests = await requestFunctions(Request.find({ status }));
  return requests;
}

export async function getAllMentors() {
  const mentors = await User.find({
    $or: [{ isMentor: true }],
  })
    .collation({ locale: "en" })
    .sort("discordName")
    .lean();

  return mentors;
}

export async function getMentorDetails(id) {
  return await User.findOne({ discordId: id }).then((mentor) =>
    singleCleaner(mentor)
  );
}

export async function getAllUsers() {
  const users = await User.find()
    .collation({ locale: "en" })
    .sort("discordName");
  const newUsers = await Promise.all(
    users.map(async (mentor) => {
      const lastTaken = (
        await Request.findOne({ mentor: mentor._id }).sort({
          accepted: -1,
        })
      )?.accepted;

      const lastCompleted = (
        await Request.findOne({
          mentor: mentor._id,
          status: "Completed",
        }).sort({ completed: -1 })
      )?.completed;

      return {
        ...mentor.toObject(),
        lastTaken: lastTaken || null,
        lastCompleted: lastCompleted || null,
      };
    })
  );
  return cleaner(newUsers);
}

export async function getStudentRequestsByDiscordId(id) {
  return await Request.find({ discordId: id })
    .select("-createdAt -updatedAt -__v")
    .populate("mentor")
    .lean()
    .then((requests) => cleaner(requests));
}

export async function getMentorRequests(_id) {
  const requests = await Request.find({
    mentor: ObjectId(_id),
  })
    .sort({ completed: -1 })
    .lean()
    .then((items) => cleaner(items));
  return requests;
}

export async function getUserById(id) {
  return await User.findOne({ discordId: id })
    .select("-__v -createdAt -updatedAt")
    .lean();
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

export async function tryRegisterMentor(user) {
  const registeredUser = await getUserById(user.discordId);
  if (registeredUser) {
    throw "mentor is already registered";
  }

  const newUser = new User({
    ...user,
    isMentor: true,
  });
  await newUser.save();
  return "mentor created!";
}

export async function editUser(body) {
  try {
    const { userId, command } = body;
    const user = await User.findById(userId);
    switch (command) {
      case "SET_MENTOR":
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
  } catch {
    return `Error trying to run ${body.command}`;
  }
}

export async function deleteUser({ user }) {
  try {
    const response = await User.deleteOne({ _id: ObjectId(user) });
    console.log(response);
    return "User deletion success!";
  } catch {
    return "Error trying to delete user";
  }
}

export async function changeRequest({ body, user }) {
  const now = new Date();
  const request = await Request.findById(body.id);

  if (!request) {
    throw { error: "I uh... what?" };
  }

  let action = body.type;

  switch (body.type) {
    case "status":
      request.mentor = user._id;
      request.status = body.value;
      action = body.value;

      switch (body.value) {
        case "In-Progress":
          request.accepted = now;
          break;
        case "Not Accepted":
          request.accepted = null;
          request.completed = null;
          break;
        case "Completed":
          request.completed = now;
          break;
        case "Problem":
          if (!request.accepted) {
            request.accepted = now;
          }
          request.completed = now;
          break;
      }
      break;
    case "remarks":
      request.remarks = body.value;
      break;
    case "archive":
      request.archived = true;
      break;
  }

  request.interactedMentors.push({
    mentor: user._id,
    action,
    date: new Date(),
  });
  await request.save();
}
