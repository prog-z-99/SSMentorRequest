import { getSessionUser } from "../../util/databaseAccess";

export default async (req, res) => {
  switch (req.method) {
    case "POST": {
      const user = await getSessionUser(req.body);
      res.status(200).send(user);
      break;
    }
    default: {
      res.status(404);
      break;
    }
  }
};
