import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../util/mongodb";
import Request from "../../../models/requestModel";

export default async (req, res) => {
  if (req.method === "POST") {
    const session = await getSession({ req });

    if (session) {
      await connectToDatabase();
      const { user } = session;

      const hasRequest = await Request.findOne({
        discordId: req.body.discordId,
      });

      if (hasRequest) {
        res.status(401).send("user already has request");
      } else {
        const request = new Request({
          ...req.body,
          discordName: `${user.name}#${user.discriminator}`,
          discordId: user.id,
        });
        const state = await request.save();
        if (state) {
          res.send({ content: "Success!" });
        } else res.send({ error: "creation failed" });
      }
    } else {
      res.status(401).send({
        error: "You must be signed in.",
      });
    }
  } else {
    res.status(404);
  }
};
