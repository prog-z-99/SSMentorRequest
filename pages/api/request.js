import { connectToDatabase } from "../../util/mongodb";
import Request from "/models/requestModel";

connectToDatabase();

export default async (req, res, next) => {
  if (req.method === "GET") {
    const requests = await getAllRequests();
    res.status(200).send(requests);
  } else {
    res.status(404);
  }
};

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
