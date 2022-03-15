import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../util/mongodb";
import Request from "../../../models/requestModel";
import User from "../../../models/userModel";
import { ObjectID } from "mongodb";

export default async (req, res) => {
  if (req.method === "PUT") {
    const session = await getSession({ req });

    if (session) {
      await connectToDatabase();
      const { user } = session;

      const request = await Request.findOne({ _id: req.body.id });
      const mentor = await User.findOne({
        discordId: user.id,
        userType: { $ne: "user" },
      });

      if (!request || !mentor) {
        res.status(400).send({ error: "I uh... what?" });
      } else {
        if (req.body.type == "delete") {
          await Request.deleteOne({
            _id: ObjectID(request._id),
          });
        } else {
          switch (req.body.type) {
            case "status":
              request.mentor = mentor._id;
              request.status = req.body.value;

              switch (req.body.value) {
                case "In-Progress":
                  request.accepted = new Date();
                  break;
                case "Not Accepted":
                  request.mentor = null;
                  request.accepted = null;
                  request.completed = null;
                  break;
                case "Completed":
                  request.completed = new Date();
                  break;
              }
              break;
            case "remarks":
              request.remarks = req.body.value;
              break;
            case "archive":
              request.archived = true;
              break;
          }
          await request.save();
        }
      }
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
