import { getToken } from "next-auth/jwt";
import {
  commentApp,
  deleteApp,
  processApp,
  voteOnApp,
} from "../../../util/dbaccess/applicationsMethods";
import {
  isUserAdmin,
  isUserReviewer,
} from "../../../util/dbaccess/userMethods";

const userApplication = async (req, res) => {
  const token = await getToken({ req });
  let message;
  try {
    const requester = await isUserReviewer(token.sub);

    if (!requester) {
      throw "Not authorized";
    }

    switch (req.method) {
      case "PUT": {
        await voteOnApp({ ...req.body, reviewer: token.sub });
        message = "Vote success!";
        break;
      }
      case "POST": {
        await processApp(req.body);
        res.status(200).send("Step completed successfully!");
        break;
      }
      case "PATCH": {
        commentApp({ ...req.body, commenterId: token.sub });
        break;
      }
      case "DELETE": {
        if (!(await isUserAdmin(token.sub))) throw 403;
        deleteApp(req.body);
        break;
      }
    }
    res.status(200).send(message);
  } catch (error) {
    res.status(401).send({ error });
  }
};

export default userApplication;
