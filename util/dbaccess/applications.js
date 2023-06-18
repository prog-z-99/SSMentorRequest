import MentorApp from "../../models/mentorAppModel";
import Users from "../../models/userModel";
import { cleaner } from "../helper";

export async function checkAppStatus(id) {
  const fetchAppStatus = MentorApp.findOne({ discordId: id });
  const mentor = await Users.findOne({ discordId: id });

  if (mentor?.isMentor) return { isMentor: true };
  if (await fetchAppStatus) return { isPending: true };
  return {};
}

export async function checkPendingApp(id) {
  return (await MentorApp.findOne({ discordId: id })) && true;
}

export async function createApp(user, details) {
  const app = new MentorApp({
    ...details,
    discordId: user.sub,
    discordName: `${user.name}#${user.discriminator}`,
  });

  return await app.save();
}

export async function getAllApps(processed) {
  const query = processed !== undefined ? { processed } : {};
  return await MentorApp.find(query)
    .select(" -updatedAt -__v")
    .populate("yay nay meh")
    .lean()
    .then((data) => cleaner(data));
}

export async function voteOnApp({ id, vote, reviewer }) {
  const app = await MentorApp.findOne({ discordId: id });

  app.yay = app.yay.filter((id) => id != reviewer);
  app.nay = app.nay.filter((id) => id != reviewer);
  app.meh = app.meh.filter((id) => id != reviewer);
  app[vote].push(reviewer);
  await app.save();
}

export async function deleteApp(id) {
  const response = await MentorApp.findOneAndDelete({ discordId: id });
  console.log(response);
}

export async function processApp(id) {
  const resp = await MentorApp.findOneAndUpdate(
    { discordId: id },
    { processed: true }
  );
  console.log(resp);
}

export async function commentApp({ reviewer, id, comment }) {
  const app = await MentorApp.findOne({ discordId: id });
  app.comments = app.comments.filter((target) => target.mentor != reviewer);
  app.comments.push({ mentor: reviewer, comment });
  await app.save();
}
