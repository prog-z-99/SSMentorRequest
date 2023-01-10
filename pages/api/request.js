import { getAllRequests, isRequestPending } from "../../util/databaseAccess";

export default async (req, res, next) => {
  switch (req.method) {
    case "GET":
      const requests = await getAllRequests();
      res.status(200).send(requests);
      break;
    case "POST":
      const isPending = await isRequestPending(req.body);
      res.status(200).send(isPending);
      break;
    default:
      res.status(404);
  }
};
