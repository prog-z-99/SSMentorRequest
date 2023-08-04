import {
  getMentorRequests,
  getUserById,
  isUserAdmin,
} from "../../../../util/databaseAccess";

import { getToken } from "next-auth/jwt";

export default async function GetMentorDetails(req, res) {
  try {
    const token = await getToken({ req });

    if (!token) {
      throw 403;
    }

    if (!(await isUserAdmin(token.sub))) throw 403;
    switch (req.method) {
      case "GET": {
        const mentor = await getUserById(req.query.id);
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
