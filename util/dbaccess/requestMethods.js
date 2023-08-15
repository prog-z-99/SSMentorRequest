import mongoose from "mongoose";
import Request from "../../models/requestModel";
import dbConnect from "../mongodb";
import { getCleanedDiscordUser, getMonthsAgo } from "../helper";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

mongoose.set("strictQuery", false);
dbConnect();

const getRequests = async (fields) => {
  return await Request.find(fields)
    .select(
      "_id discordName summonerName createdAt rank role champions timezone status accepted"
    )
    .sort({ createdAt: 1 })
    .lean();
};

export async function getAllRequests() {
  const threeMonthsAgo = getMonthsAgo(3);
  const yearAgo = getMonthsAgo(12);
  const requests = await getRequests({
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
  });

  return requests;
}

export const getRequestDetails = async (id) => {
  return await Request.findById(id)
    .populate({
      path: "mentor",
      model: "User",
      select: "discordName discordId",
    })
    .populate({
      path: "comments.commenter",
      model: "User",
      select: "discordName discordId",
    });
};

export async function getTypeRequests(status) {
  return await getRequests({ status });
}

export const getStudentRequestsByDiscordId = async (id) => {
  return await getRequests({ discordId: id });
};

export async function getMentorRequests(_id) {
  //TODO: verify if this route needs cleanup
  const requests = await Request.find({
    mentor: ObjectId(_id),
  })
    .sort({ accepted: -1 })
    .lean();
  return requests;
}

export async function deleteRequest(id) {
  const state = await Request.findByIdAndDelete(id);
  console.log(state);
}

export async function createRequest({ values, user }) {
  const pending = await isRequestPending(user.sub);

  if (pending) throw Error;

  const request = new Request({
    ...values,
    discordName: getCleanedDiscordUser(user),
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
    (!request.completed ||
      dayjs(request.completed).add(1, "months").isBefore(dayjs()))
  ) {
    return true;
  }

  return false;
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

export const addRequestComment = async ({
  commenterId,
  requestId,
  content,
}) => {
  const request = await Request.findById(requestId);
  request.comments.push({ commenter: commenterId, content });
  await request.save();
};
