import { getToken } from "next-auth/jwt";
import { createRequest, isRequestPending } from "../../util/databaseAccess";

export default async function Request(req, res) {
  const token = await getToken({ req });
  if (!token) {
    res.status(403).send({ error: "what" });
    return;
  }

  try {
    switch (req.method) {
      case "GET": {
        const pending = await isRequestPending(token.sub);
        res.status(200).send(pending);
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
}
