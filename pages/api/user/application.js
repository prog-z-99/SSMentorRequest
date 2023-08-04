import { getToken } from "next-auth/jwt";
import {
  checkAppStatus,
  checkPendingApp,
  createApp,
} from "../../../util/dbaccess/applicationsMethods";

const userApplication = async (req, res) => {
  const token = await getToken({ req });
  let message;
  try {
    switch (req.method) {
      case "GET": {
        const pending = await checkAppStatus(token.sub);

        message = pending;
        break;
      }
      case "POST": {
        const pending = await checkPendingApp(token.sub);

        if (pending)
          throw "App already sent, please wait for us to process your application";

        await createApp(token, req.body);
        message = true;
        break;
      }
    }
    res.status(200).send(message);
  } catch (error) {
    res.status(401).send({ error });
  }
};

export default userApplication;
