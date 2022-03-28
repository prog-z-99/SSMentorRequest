import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../util/mongodb";
import User from "../../models/userModel";

export default async (req, res) => {
  if (req.method === "GET") {
    const session = await getSession({ req });
    const user = await User.findOne({ discordId: session.user.id });
    res.status(200).send(user);
  } else {
    res.status(404);
  }
};
