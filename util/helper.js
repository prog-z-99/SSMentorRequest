import Request from "/models/requestModel";

export async function getAllRequests() {
  return await Request.find({ archived: { $ne: true } })
    .populate("mentor")
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

export function checkAdmin(user) {
  return user.userType == "admin" || user.userType == "god";
}

export function isMentor(user) {
  return checkAdmin(user) || user.userType == "mentor";
}
