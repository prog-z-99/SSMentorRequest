import { connectToDatabase } from "./mongodb";
import Request from "../models/requestModel";
import User from "../models/userModel";
import { isMentor } from "./helper";
import mongoose from "mongoose";
import { ObjectID } from "mongodb";
import dayjs from "dayjs";

connectToDatabase();

export async function testRequest() {
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
            createdAt: { $gte: threeMonthsAgo },
          },
        ],
      },
      { status: { $nin: ["Completed", "Problem"] } },
    ],
  });

  return requests;
}

export async function getAllRequests() {
  const now = new Date();
  const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
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
            createdAt: { $gte: threeMonthsAgo },
          },
        ],
      },
      { status: { $nin: ["Completed", "Problem"] } },
    ],
  })
    .populate({ path: "mentor", model: "User" })
    // .limit(15)
    .sort({ createdAt: 1 })
    .then((items) => cleaner(items));
  return requests;
}

export async function getAllMentors() {
  return await User.find().then((mentors) =>
    mentors.map((mentor) => ({
      discordId: mentor.discordId,
      discordName: mentor.discordName,
      _id: mentor._id.toString(),
      userType: mentor.userType,
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

export async function editUser(body) {
  try {
    const { userID, command } = body;
    const user = await User.findById(userID);
    switch (command) {
      case "SET_MENTOR":
        user.userType = "mentor";
        break;
      case "SET_USER":
        user.userType = "user";
        break;
      case "SET_ADMIN":
        user.userType = "admin";
        break;
    }
    await user.save();
    return `Sucessfully edited to ${command}`;
  } catch {
    return `Error trying to run ${command}`;
  }
}

export async function changeRequest(body) {
  const { user } = body.session;

  const request = await Request.findOne({ _id: body.id });
  const mentor = await User.findOne({
    discordId: user.id,
    userType: { $ne: "user" },
  });

  if (!request || !mentor) {
    throw { error: "I uh... what?" };
  }

  if (body.type == "delete") {
    await Request.deleteOne({
      _id: ObjectID(request._id),
    });

    return "Success";
  }

  switch (body.type) {
    case "status":
      request.mentor = mentor._id;
      request.status = body.value;

      switch (body.value) {
        case "In-Progress":
          request.accepted = new Date();
          break;
        case "Not Accepted":
          request.mentor = null;
          request.accepted = null;
          request.completed = null;
          break;
        case "Completed":
          request.completed = new Date();
          break;
        case "Problem":
          request.completed = new Date();
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
  await request.save();
}

export async function createRequest(body) {
  const {
    session: { user },
    values,
  } = body;

  const hasRequest = await Request.findOne({
    discordId: values.discordId,
  });

  if (hasRequest) {
    throw res.status(401).send("user already has request");
  }

  const request = new Request({
    ...values,
    discordName: `${user.name}#${user.discriminator}`,
    discordId: user.id,
  });

  return await request.save();
}

function cleaner(items) {
  return items.map((item) => ({
    id: item._id.toString(),
    status: item.status,
    rank: item.rank,
    region: item.region,
    summonerName: item.summonerName || item.opgg || "what?",
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
