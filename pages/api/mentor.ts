import {
  getMentorRequests,
  getUserById,
  isUserMentor,
} from "../../util/databaseAccess";

import { getToken } from "next-auth/jwt";

export default async function MentorAPI(req, res) {
  try {
    const token = await getToken({ req });

    if (!token) {
      throw 403;
    }

    if (!(await isUserMentor(token.sub))) throw 403;

    switch (req.method) {
      case "GET": {
        const mentor = await getUserById(token.sub);
        const requests = await getMentorRequests(mentor._id);
        res.status(200).send({ requests, mentor });
        break;
      }
      default: {
        throw 404;
      }
    }
  } catch (error) {
    res.status(error);
  }
}
