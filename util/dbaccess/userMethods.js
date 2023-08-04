import User from "../../models/userModel";

export async function getUsersById(ids) {
  const users = await User.find({ discordId: { $in: ids } })
    .lean()
    .select("discordName discordId");

  return users;
}
