import {
  isUserAdmin,
  isUserMentor,
  isUserReviewer,
  isUserStaff,
} from "../../../util/databaseAccess";

import { getToken } from "next-auth/jwt";

export default async function GetUser(req, res) {
  const token = await getToken({ req });

  if (!token) {
    res.status(403).send({ error: "what" });
    return;
  }
  switch (req.method) {
    //   case "GET": {
    //     const response = await getAllUsers();
    //     res.status(200).send(response);
    //     break;
    //   }
    case "GET": {
      switch (req.query.type) {
        case "reviewer":
          res.status(200).send(await isUserReviewer(token.sub));
          break;
        case "admin":
          res.status(200).send(await isUserAdmin(token.sub));
          break;
        case "staff":
          res.status(200).send(await isUserStaff(token.sub));
          break;
        case "mentor":
          res.status(200).send(await isUserMentor(token.sub));
          break;
      }
      break;
    }
    //   case "POST": {
    //     const response = await deleteUser(req.body);
    //     res.status(200).send(response);
    //     break;
    //   }
    default: {
      res.status(404);
    }
  }
}
