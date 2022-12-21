import axios from "axios";

export function checkAdmin(user) {
  return user.userType == "admin" || user.userType == "god";
}

export function isMentor(user) {
  return checkAdmin(user) || user.userType == "mentor";
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
    `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`
  );
  const championList = [];
  for (let champion in request.data.data) {
    championList.push(request.data.data[champion].name);
  }
  championList.sort();
  return championList;
}
