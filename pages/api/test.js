import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../util/mongodb";
import Request from "../../models/requestModel";
import User from "../../models/userModel";

export default async (req, res) => {
  if (req.method === "POST") {
    res.status(404);
  } else if (req.method === "GET") {
    await connectToDatabase();
    await Request.syncIndexes();
    await User.syncIndexes();
    res.status(200).send("indexes synced");
  } else {
    res.status(404);
  }
};
