import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  const user = req.body.user;

  const resources = [
    {
      object: "room",
      room: body.room,
      permission: "join",
    },
  ];

  const r = await fetch("https://super.roomservice.dev/provision", {
    method: "post",
    headers: {
      Authorization: `Bearer: ${process.env.ROOMSERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user,
      resources,
    }),
  });

  const json = await r.json();
  res.json(json);
};
