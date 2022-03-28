import { getAllRequests, isRequestPending } from "../../util/databaseAccess";

export default async (req, res, next) => {
  if (req.method === "GET") {
    const requests = await getAllRequests();
    res.status(200).send(requests);
  } else if (req.method == "POST") {
    const isPending = await isRequestPending(req.body);
    res.status(200).send(isPending);
  } else {
    res.status(404);
  }
};
