import {
  editUser,
  getUserById,
  tryRegisterMentor,
} from "../../../util/databaseAccess";
import { getToken } from "next-auth/jwt";
import { processApp } from "../../../util/dbaccess/applicationsMethods";

const userMentor = async (req, res) => {
  const token = await getToken({ req });
  try {
    switch (req.method) {
      case "GET": {
        await getUserById(token.id);
        res.status(200).send();
        break;
      }
      case "POST": {
        switch (req.body.command) {
          case "ACCEPT": {
            await processApp(req.body.user.discordId);
            await tryRegisterMentor(req.body.user);
            res.status(200).send("mentor added!");
            break;
          }
          case "DENY": {
            await processApp(req.body.user.discordId);
            res.status(200).send("mentor denied!");
            break;
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
    console.log(error);
    res.status(400).send(error);
  }
};

export default userMentor;
