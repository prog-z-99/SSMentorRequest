import {
  editUser,
  deleteUser,
  getUserById,
} from "../../util/dbaccess/userMethods";
import { getAllUsers } from "../../util/dbaccess/userMethods";
import { checkAdmin } from "../../util/helper";
import { getToken } from "next-auth/jwt";

export default async function Admin(req, res) {
  try {
    const token = await getToken({ req });

    if (!token) throw Error("what", { status: 400 });

    const requester = await getUserById(token.sub);

    if (!checkAdmin(requester)) Error("Not an admin", { status: 403 });

    switch (req.method) {
      case "GET": {
        const users = await getAllUsers();
        res.status(200).send({ users });
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
  } catch ({ message, options: { status } }) {
    res.status(status).send(message);
  }
}
