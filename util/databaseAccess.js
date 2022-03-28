import { connectToDatabase } from "./mongodb";
import Request from "../models/requestModel";

connectToDatabase();

export async function getAllRequests() {
  return await Request.find({ archived: { $ne: true } })
    .populate({ path: "mentor", model: "User" })
    .then((items) =>
      items.map((item) => ({
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
      }))
    );
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
