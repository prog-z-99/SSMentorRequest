import { getToken } from "next-auth/jwt";
import { editUser, isUserMentor } from "../../../util/dbaccess/userMethods";

const userMentor = async (req, res) => {
  try {
    const token = await getToken({ req });
    if (!(await isUserMentor(token.sub))) throw Error("Auth error 401");

    switch (req.method) {
      // case "GET": {
      //   await getUserById(token.id);
      //   res.status(200).send();
      //   break;
      // }
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
