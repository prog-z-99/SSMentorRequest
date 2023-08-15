import { getToken } from "next-auth/jwt";

import { checkAdmin, checkStaff } from "../../../util/helper";
import {
  addRequestComment,
  changeRequest,
  deleteRequest,
  getRequestDetails,
} from "../../../util/dbaccess/requestMethods";
import { getUserById } from "../../../util/dbaccess/userMethods";

export default async function requestByID(req, res) {
  try {
    const fetchToken = getToken({ req });
    if (req.query.id.length == 18) throw Error("invalid id");

    const token = await fetchToken;
    if (!token) throw Error("What");

    const user = await getUserById(token.sub);
    if (!checkStaff(user)) throw "Not authorized";

    switch (req.method) {
      default: {
        res.status(404);
        break;
      }
      case "GET": {
        const request = await getRequestDetails(req.query.id);
        res.status(200).send(request);
        break;
      }
      case "DELETE": {
        if (!checkAdmin(user)) throw "Not authorized";

        await deleteRequest(req.query.id);
        res.status(200).send("Request successfully deleted");
        break;
      }
      case "PUT": {
        await changeRequest({ body: { ...req.body, id: req.query.id }, user });
        res.status(200).send("Request status updated");
        break;
      }
      case "PATCH": {
        await addRequestComment({
          commenterId: user._id,
          requestId: req.query.id,
          content: req.body.content,
        });
        res.status(200).send("Comment added");
        break;
      }
    }
  } catch (error) {
    res.status(401).send(error);
  }
}
