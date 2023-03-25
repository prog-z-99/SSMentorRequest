import { getToken } from "next-auth/jwt";
import {
  checkPendingApp,
  createApp,
  deleteApp,
  isUserAdmin,
  isUserReviewer,
  voteOnApp,
} from "../../../util/databaseAccess";

export default async (req, res) => {
  const token = await getToken({ req });
  let message;
  try {
    switch (req.method) {
      case "POST": {
        const pending = await checkPendingApp(token.sub);

        if (pending)
          throw "App already sent, please wait for us to process your application";

        await createApp(token, req.body);
        message = true;
        break;
      }
      case "PUT": {
        const requester = await isUserReviewer(token.sub);
        if (requester) {
          voteOnApp({ ...req.body, reviewer: token.sub });
        } else throw "Not authorized";
        break;
      }
      case "PATCH": {
        const requester = await isUserAdmin(token.sub);
        if (requester) {
          deleteApp(req.body);
        } else throw "Not authorized";
        break;
      }
    }
    res.status(200).send(message);
  } catch (error) {
    res.status(401).send({ error });
  }
};
