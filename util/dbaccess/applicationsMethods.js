import MentorApp from "../../models/mentorAppModel";
import Users from "../../models/userModel";
import { getUserById } from "../databaseAccess";
import { getUsersById } from "./userMethods";

export async function checkAppStatus(id) {
  const appStatus = MentorApp.findOne({ discordId: id });
  const mentor = await Users.findOne({ discordId: id });
  if (mentor?.isMentor) return { isMentor: true };
  if (await appStatus) {
    if (appStatus.processed) return { isDenied: true };
    return { isPending: true };
  }
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
  const apps = await MentorApp.find(query)
    .select(" -updatedAt -__v")
    .populate("comments.commenter")
    .lean();
  //This should be simpler, but at least it works atm
  const newApps = await Promise.all(
    apps.map(async (app) => {
      // console.log(app);
      return {
        ...app,
        voted: await getUsersById(app.yay.concat(app.nay.concat(app.meh))),
      };
    })
  );

  return newApps;
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

export async function commentApp({ commenterId, user, content }) {
  const app = await MentorApp.findOne({ discordId: user });
  const commenter = await getUserById(commenterId);
  app.comments.push({ commenter: commenter._id, content });
  await app.save();
}
