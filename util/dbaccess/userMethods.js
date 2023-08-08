import User from "../../models/userModel";
import { getCleanedDiscordUser } from "../helper";
import { getLatestDiscordProfile } from "./discordMethods";

export async function getUsersById(ids) {
  const users = await User.find({ discordId: { $in: ids } })
    .lean()
    .select("discordName discordId");

  return users;
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
