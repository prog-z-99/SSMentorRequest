const Test = async (req, res) => {
  if (req.method === "POST") {
    res.status(404);
  } else if (req.method === "GET") {
    res.status(200).json("test");
  } else {
    res.status(404);
  }
};

export default Test;
