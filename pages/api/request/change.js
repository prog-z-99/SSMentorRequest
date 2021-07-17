import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../util/mongodb";
import Request from "../../../models/requestModel";
import User from "../../../models/userModel";

export default async (req, res) => {
  if (req.method === "PUT") {
    const session = await getSession({ req });

    if (session) {
      await connectToDatabase();
      const { user } = session;
      await Request.syncIndexes();

      const request = await Request.findOne({ _id: req.body.id });
      const mentor = await User.findOne({ discordId: user.id });

      if (!request || !mentor) {
        res.status(400).send({ error: "I uh... what?" });
      } else {
        request.mentor = mentor._id;
        request.status = req.body.value;

        switch (req.body.value) {
          case "In-Progress":
            request.accepted = new Date();
            break;
          case "Not Accepted":
            request.mentor = null;
            break;
          case "Completed":
            request.completed = new Date();
            break;
        }
      }
      const state = await request.save();
      res.status(200).send("Success!");
    } else {
      res.status(401).send({
        error: "You must be signed in.",
      });
    }
  } else {
    res.status(404);
  }
};
