import { getToken } from "next-auth/jwt";
import { getAllApps } from "../../../util/dbaccess/applicationsMethods";
import { getUserById } from "../../../util/dbaccess/userMethods";

export default async function Apps(req, res) {
  const token = await getToken({ req });
  if (!token) {
    res.status(403).send({ error: "what" });
    return;
  }
  const user = await getUserById(token.sub);
  try {
    if (!user.isReviewer) throw "Not authorized";
    switch (req.method) {
      case "GET": {
        const allApps = await getAllApps();
        res.status(200).send({ allApps, reviewerId: token.sub });
        break;
      }

      default:
        res.status(404);
    }
  } catch (error) {
    res.status(401).send(error);
  }
}
