import axios from "axios";

export const getLatestProfile = async (id) => {
  return await axios
    .get(`https://discord.com/api/v9/users/${id}`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    })
    .then(({ data }) => data);
};

export const sendDMToUser = async (id, message) => {
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
