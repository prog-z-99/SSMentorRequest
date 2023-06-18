import { connectToDatabase } from "./mongodb";
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

mongoose.set("strictQuery", false);
connectToDatabase();

export async function testRequest() {
  // await User.updateMany({ userType: "mentor" }, { isMentor: true });
  return "Bonga";
}

export async function getAllRequests() {
  const now = new Date();
  const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
  const yearAgo = new Date(now.setMonth(now.getMonth() - 9));
  const requests = await Request.find({
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
    .select("-interactedMentors -__v -updatedAt")
    .populate({
      path: "mentor",
      model: "User",
      select: "discordName discordId",
    })
    // .limit(5)
    .sort({ createdAt: 1 })
    .lean();
  return requests;
}

export async function getTypeRequests(type) {
  const requests = await Request.find({ status: type })
    .populate({
      path: "mentor",
      model: "User",
      select: "discordName discordId",
    })
    .sort({ createdAt: 1 })
    .lean();
  return requests;
}

export async function getAllMentors() {
  const mentors = await User.find({
    $or: [{ isMentor: true }],
  })
    .collation({ locale: "en" })
    .sort("discordName")
    .lean();

  return cleaner(mentors);
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

export async function isRequestPending(id) {
  const request = await Request.findOne({
    discordId: id,
  }).sort({ createdAt: -1 });

  if (
    request &&
    (!request.completed ||
      (wasMonthAgo(request.completed) && !request.archived))
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

export async function getUserById(id) {
  return await User.findOne({ discordId: id })
    .select("-__v -createdAt -updatedAt")
    .lean()
    .then((user) => singleCleaner(user));
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

export async function deleteRequest(id) {
  const state = await Request.findByIdAndDelete(id);
  console.log(state);
}

export async function createRequest({ values, user }) {
  const hasRequest = await Request.findOne({
    discordId: user.sub,
    status: { $ne: "Completed" },
  });

  if (hasRequest) {
    throw { error: "user already has request" };
  }

  const request = new Request({
    ...values,
    discordName: `${user.name}#${user.discriminator}`,
    discordId: user.sub,
  });
  return await request.save();
}
