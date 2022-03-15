import { connectToDatabase } from "../../util/mongodb";
import { getAllRequests } from "../../util/helper";

export default async (req, res, next) => {
  if (req.method === "GET") {
    await connectToDatabase();
    const requests = await getAllRequests();
    res.status(200).send(requests);
  } else {
    res.status(404);
  }
};
