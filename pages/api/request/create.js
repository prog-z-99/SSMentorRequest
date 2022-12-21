import { createRequest } from "../../../util/databaseAccess";

export default async (req, res) => {
  if (req.method === "POST") {
    if (req.body.session) {
      const state = await createRequest(req.body);
      if (state) {
        res.send({ content: "Success!" });
      } else res.send({ error: "creation failed" });
    } else {
      res.status(401).send({
        error: "You must be signed in.",
      });
    }
  } else {
    res.status(404);
  }
};
