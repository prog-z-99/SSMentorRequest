import { tryRegisterMentor } from "../../../util/databaseAccess";

export default async (req, res) => {
  if (req.method === "POST") {
    const response = await tryRegisterMentor(req.body);
    res.status(200).send(response);
  } else {
    res.status(404);
  }
};
