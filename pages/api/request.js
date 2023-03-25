import { getToken } from "next-auth/jwt";
import {
  createRequest,
  getAllRequests,
  getTypeRequests,
  isUserMentor,
} from "../../util/databaseAccess";

export default async (req, res) => {
  const token = await getToken({ req });
  if (!token) {
    res.status(403).send({ error: "what" });
    return;
  }
  const fetchIsMentor = isUserMentor(token.sub);
  try {
    switch (req.method) {
      case "GET": {
        const isMentor = await fetchIsMentor;
        if (!isMentor) throw "Not authorized";

        const requests = await getAllRequests();
        res.status(200).send(requests);
        break;
      }
      case "PUT": {
        const isMentor = await fetchIsMentor;
        if (!isMentor) throw "Not authorized";

        const requests = await getTypeRequests(req.body.type);
        res.status(200).send(requests);
        break;
      }
      case "POST": {
        await createRequest({ values: req.body, user: token });
        res.send({ content: "Success!" });
        break;
      }
      default:
        res.status(404);
    }
  } catch (error) {
    res.status(401).send(error);
  }
};
