import { getSessionUser } from "../../util/databaseAccess";

export default async (req, res) => {
  if (req.method === "POST") {
    const user = await getSessionUser(req.body);
    res.status(200).send(user);
  } else {
    res.status(404);
  }
};
