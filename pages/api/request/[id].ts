import { getToken } from "next-auth/jwt";

import { checkAdmin, checkStaff } from "../../../util/helper";
import {
  changeRequest,
  deleteRequest,
  getStudentRequestsByDiscordId,
} from "../../../util/dbaccess/requestMethods";
import { getUserById } from "../../../util/dbaccess/userMethods";

export default async function requestByID(req, res) {
  const fetchToken = getToken({ req });
  if (req.query.id.length == 18) {
    res.status(400).send({ error: "invalid id" });
    return;
  }
  const token = await fetchToken;
  if (!token) {
    res.status(403).send({ error: "what" });
    return;
  }
  const fetchUser = getUserById(token.sub);

  try {
    switch (req.method) {
      default: {
        res.status(404);
        break;
      }
      case "GET": {
        const user = await fetchUser;
        if (!checkAdmin(user)) throw "Not authorized";
        const requests = await getStudentRequestsByDiscordId(req.query.id);
        res.status(200).send({ requests });
        break;
      }
      case "DELETE": {
        const user = await fetchUser;
        if (!checkAdmin(user)) throw "Not authorized";

        await deleteRequest(req.query.id);
        res.status(200).send("Request successfully deleted");
        break;
      }
      case "PUT": {
        const user = await fetchUser;
        if (!checkStaff(user)) throw "Not authorized";
        await changeRequest({ body: { ...req.body, id: req.query.id }, user });
        res.status(200).send("Request status updated");
      }
    }
  } catch (error) {
    res.status(401).send(error);
  }
}
