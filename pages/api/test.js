import { testRequest } from "../../util/databaseAccess";

const Test = async (req, res) => {
  if (req.method === "POST") {
    res.status(404);
  } else if (req.method === "GET") {
    await testRequest();
    res.status(200).send("test");
  } else {
    res.status(404);
  }
};

export default Test;
