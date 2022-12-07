import { editUser, tryRegisterMentor } from "../../../util/databaseAccess";

export default async (req, res) => {
  switch (req.method) {
    case "POST": {
      const response = await tryRegisterMentor(req.body);
      res.status(200).send(response);
    }
    case "EDIT": {
      const response = await editUser(req.body);
      res.status(200).send(response);
      break;
    }
    default: {
      res.status(404);
    }
  }
};
