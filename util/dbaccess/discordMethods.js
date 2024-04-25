import axios from "axios";
import mongoose from "mongoose";
import dbConnect from "../mongodb";
mongoose.set("strictQuery", false);
dbConnect();

const discordAPI = `https://discord.com/api/v9/`;

export const getLatestDiscordProfile = async (id) => {
  return await axios
    .get(`${discordAPI}users/${id}`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    })
    .then(({ data }) => data);
};

export const sendDMToUser = async (
  id,
  message = `If you see this message, please notify <@153289671483457536>`
) => {
  const { data } = await axios.post(
    `${discordAPI}users/@me/channels`,
    { recipient_id: id },
    {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    }
  );

  axios
    .post(
      `${discordAPI}channels/${data.id}/messages`,
      { content: message },
      {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
      }
    )
    .then(() => console.log(id, "---Success!"));
};

export const getDMHistory = async (discordId) => {
  const { data } = await axios
    .post(
      `${discordAPI}users/@me/channels`,
      { recipient_id: discordId },
      {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
      }
    )
    .catch(({ response }) => console.log(discordId, response.status));

  const response = await axios.get(
    `${discordAPI}channels/${data.id}/messages`,
    {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    }
  );

  console.log(response.data);
};
