import { getToken } from "next-auth/jwt";

import { checkStaff } from "../../../util/helper";
import { getStudentRequestsByDiscordId } from "../../../util/dbaccess/requestMethods";
import { getUserById } from "../../../util/dbaccess/userMethods";

export default async function requestByID(req, res) {
  try {
    const token = await getToken({ req });
    if (!token) throw Error("What");

    const user = await getUserById(token.sub);
    if (!checkStaff(user)) throw "Not authorized";

    switch (req.method) {
      default: {
        res.status(404);
        break;
      }
      case "GET": {
        const requests = await getStudentRequestsByDiscordId(req.query.id);
        console.log(requests);
        res.status(200).send({ requests });
        break;
      }
    }
  } catch (error) {
    res.status(401).send(error);
  }
}
