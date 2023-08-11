import { getToken } from "next-auth/jwt";
import { isUserStaff } from "../../../util/dbaccess/userMethods";
import {
  getAllRequests,
  getTypeRequests,
} from "../../../util/dbaccess/requestMethods";

export default async function AdminRequests(req, res) {
  const token = await getToken({ req });
  if (!token) {
    res.status(403).send({ error: "what" });
    return;
  }
  const isStaff = await isUserStaff(token.sub);
  try {
    switch (req.method) {
      case "GET": {
        if (!isStaff) throw "Not authorized";

        const requests = await getAllRequests();
        res.status(200).send(requests);
        break;
      }
      case "PUT": {
        if (!isStaff) throw "Not authorized";

        const requests = await getTypeRequests(req.body.type);
        res.status(200).send(requests);
        break;
      }

      default:
        res.status(404);
    }
  } catch (error) {
    res.status(401).send(error);
  }
}
