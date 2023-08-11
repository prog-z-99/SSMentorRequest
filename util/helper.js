import axios from "axios";
import { champRoles } from "./datalist";
import dayjs from "dayjs";

export function checkAdmin(user) {
  return user?.isAdmin;
}

export function checkMentor(user) {
  return user?.isMentor;
}

export function checkTrial(user) {
  return user?.isTrial;
}

export function checkStaff(user) {
  return checkAdmin(user) || checkMentor(user) || checkTrial(user);
}

export function checkReviewer(user) {
  return user?.isReviewer;
}

export function copyClip(text) {
  navigator.clipboard.writeText(text);
}

export async function getAllChampions() {
  const versions = await axios.get(
    "https://ddragon.leagueoflegends.com/api/versions.json"
  );
  const latestVersion = versions.data[0];
  const request = await axios.get(
    `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`
  );
  const tempList = [];
  for (let champion in request.data.data) {
    tempList.push(request.data.data[champion].name);
  }
  tempList.sort();

  return tempList;
}

export const getAllMentorChampions = async () => {
  return champRoles.concat(await getAllChampions());
};

export function cleaner(items) {
  return items.map((item) => {
    return singleCleaner(item);
  });
}

export function singleCleaner(obj) {
  for (let key in obj) {
    const objValue = obj[key];
    if (
      objValue &&
      typeof objValue == "object" &&
      !objValue.length &&
      objValue.length != 0
    ) {
      obj[key] = objValue.toString();
    } else if (key == "mentor") obj[key] = objValue?.discordName || null;
    else if (objValue === undefined) {
      obj[key] = null;
    }
  }

  return obj;
}

export const getCleanedDiscordUser = (user) => {
  if (!user) return "missing";

  if (user.discriminator == "0") return `${user.username || user.name}`;

  return `${user.name || user.username}#${user.discriminator}`;
};

export const getMonthsAgo = (months) => {
  const ago = dayjs().subtract(months, "months");
  return ago;
};
