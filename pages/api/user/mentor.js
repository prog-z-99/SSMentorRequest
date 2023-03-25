import {
  editUser,
  getUserById,
  processApp,
  tryRegisterMentor,
} from "../../../util/databaseAccess";
import { getToken } from "next-auth/jwt";

export default async (req, res) => {
  const token = await getToken({ req });
  try {
    switch (req.method) {
      case "GET": {
        await getUserById(token.id);
        res.status(200).send();
        break;
      }
      case "POST": {
        switch (req.command) {
          case "ACCEPT": {
            await processApp(req.user.discordId);
            await tryRegisterMentor(req.user);
            res.status(200).send("mentor added!");
            break;
          }
          case "DENY": {
            await processApp(req.user.discordId);
            res.status(200).send("mentor denied!");
          }
        }

        break;
      }
      case "PUT": {
        await editUser(req.body);
        res.status(200).send(`${req.body.command} successfully changed`);
        break;
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
