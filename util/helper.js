import axios from "axios";

export function checkAdmin(user) {
  if (!user) return false;
  return user.isAdmin;
}

export function checkMentor(user) {
  if (!user) return false;
  return user.isMentor;
}

export function checkStaff(user) {
  if (!user) return false;
  return checkAdmin(user) || checkMentor(user);
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
