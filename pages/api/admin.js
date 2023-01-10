import { getSessionUser, editUser } from "../../util/databaseAccess";
import { checkAdmin } from "../../util/helper";
import { getSession } from "next-auth/react";

export default async (req, res) => {
  const session = await getSession({ req });
  if (!session || req.body.user) {
    res.status(403);
    return;
  }
  const requester = await getSessionUser(session);
  if (!checkAdmin(requester)) {
    res.status(403);
    return;
  }

  switch (req.method) {
    // case "POST": {
    //   const response = await tryRegisterMentor(req.body);
    //   res.status(200).send(response);
    // }
    case "PUT": {
      const response = await editUser(req.body);
      res.status(200).send(response);
      break;
    }
    default: {
      res.status(404);
    }
  }
};
