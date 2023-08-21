import axios from "axios";
import mongoose from "mongoose";
import dbConnect from "../mongodb";
mongoose.set("strictQuery", false);
dbConnect();

export const getLatestDiscordProfile = async (id) => {
  return await axios
    .get(`https://discord.com/api/v9/users/${id}`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    })
    .then(({ data }) => data);
};

export const sendDMToUser = async (
  id,
  message = `If you see this message, please notify <@153289671483457536>`
) => {
  axios
    .post(
      `https://discord.com/api/v9/users/@me/channels`,
      { recipient_id: id },
      {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
      }
    )
    .catch(({ response }) => console.log(id, response.status))
    .then(({ data }) => {
      axios
        .post(
          `https://discord.com/api/v9/channels/${data.id}/messages`,
          { content: message },
          {
            headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
          }
        )
        .catch(({ response }) => console.log(id, response.status))
        .then(() => console.log(id, "---Success!"));
    });
};
