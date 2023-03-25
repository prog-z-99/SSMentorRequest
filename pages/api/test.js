import { testRequest } from "../../util/databaseAccess";

export default async (req, res) => {
  if (req.method === "POST") {
    res.status(404);
  } else if (req.method === "GET") {
    console.log(await testRequest());
    // res.status(200).send(await testRequest());
    res.status(200).send("test");
  } else {
    res.status(404);
  }
};
