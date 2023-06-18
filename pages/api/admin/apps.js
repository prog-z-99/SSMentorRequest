import { getToken } from "next-auth/jwt";
import { isUserStaff } from "../../../util/databaseAccess";
import { getAllApps } from "../../../util/dbaccess/applications";

export default async function Apps(req, res) {
  const token = await getToken({ req });
  if (!token) {
    res.status(403).send({ error: "what" });
    return;
  }
  const isStaff = await isUserStaff(token.sub);
  try {
    if (!isStaff) throw "Not authorized";
    switch (req.method) {
      case "GET": {
        const apps = await getAllApps();
        res.status(200).send(apps);
        break;
      }

      default:
        res.status(404);
    }
  } catch (error) {
    res.status(401).send(error);
  }
}
