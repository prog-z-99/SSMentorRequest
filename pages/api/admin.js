import {
  editUser,
  deleteUser,
  getUserById,
  getAllUsers,
} from "../../util/databaseAccess";
import { checkAdmin } from "../../util/helper";
import { getToken } from "next-auth/jwt";

export default async (req, res) => {
  const token = await getToken({ req });

  if (!token) {
    res.status(403).send({ error: "what" });
    return;
  }
  const requester = await getUserById(token.sub);
  if (!checkAdmin(requester)) {
    res.status(403).send({ error: "Not an admin" });
    return;
  }
  switch (req.method) {
    case "GET": {
      const response = await getAllUsers();
      res.status(200).send(response);
      break;
    }
    case "PUT": {
      const response = await editUser(req.body);
      res.status(200).send(response);
      break;
    }
    case "POST": {
      const response = await deleteUser(req.body);
      res.status(200).send(response);
      break;
    }
    default: {
      res.status(404);
    }
  }
};
