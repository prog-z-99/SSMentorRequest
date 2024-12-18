import { getToken } from "next-auth/jwt";
import {
  createRequest,
  isRequestPending,
} from "../../util/dbaccess/requestMethods";
import { checkRiotAccount } from "../../util/dbaccess/riotMethods";

export default async function Request(req, res) {
  const token = req.body.token;

  try {
    switch (req.method) {
      case "GET": {
        const pending = await isRequestPending(token.sub);
        res.status(200).json({ pending });
        break;
      }
      case "POST": {
        if (process.env.NEXT_PUBLIC_REQUEST_STATUS == "closed") {
          res
            .status(400)
            .send({ message: "The requests are currently closed!" });
          break;
        }
        await createRequest({ values: req.body, user: token });
        res.status(200).json({ content: "Success!" });
        break;
      }
      case "PUT": {
        const data = await checkRiotAccount(req.body);
        res.status(200).json(data);
        break;
      }
      default:
        res.status(404);
    }
  } catch (error) {
    res.status(401).send(error);
  }
}
