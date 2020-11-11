import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  const user = "user-" + uuidv4();

  const r = await fetch("https://super.roomservice.dev/provision", {
    method: "post",
    headers: {
      Authorization: `Bearer: ${process.env.ROOMSERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: user,
      resources: body.resources,
    }),
  });

  const json = await r.json();
  res.json(json);
};
