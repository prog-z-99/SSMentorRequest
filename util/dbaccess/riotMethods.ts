import axios from "axios";
import { regions, regionsCode } from "../datalist";

const riotLink = "api.riotgames.com";

export const checkRiotAccount = async ({ riotId, region }) => {
  const splitId = riotId.split("#");
  const regionCode = regionsCode[regions.findIndex((i) => i == region)];
  const puuid = await axios
    .get(
      `https://europe.${riotLink}/riot/account/v1/accounts/by-riot-id/${splitId[0]}/${splitId[1]}`,
      { headers: { "X-Riot-Token": process.env.RIOT_ACCESS_TOKEN } }
    )
    .then(({ data }) => data.puuid)
    .catch((error) => console.log(error));

  const id = await axios
    .get(
      `https://${regionCode}.${riotLink}/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      { headers: { "X-Riot-Token": process.env.RIOT_ACCESS_TOKEN } }
    )
    .then(({ data }) => data.id);

  return await axios
    .get(
      `https://${regionCode}.${riotLink}/lol/league/v4/entries/by-summoner/${id}`,
      { headers: { "X-Riot-Token": process.env.RIOT_ACCESS_TOKEN } }
    )
    .then(({ data }) =>
      data.find((queue) => queue.queueType == "RANKED_SOLO_5x5")
    );
};
