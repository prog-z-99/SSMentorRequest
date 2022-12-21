import { changeRequest } from "../../../util/databaseAccess";

export default async (req, res) => {
  if (req.method === "PUT") {
    try {
      if (req.body.session) {
        await changeRequest(req.body);
        res.status(200).send("Success!");
      } else {
        res.status(401).send({
          error: "You must be signed in.",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(401).send({ error: "Some sort of an error" });
    }
  } else {
    res.status(404);
  }
};
