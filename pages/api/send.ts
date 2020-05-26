import { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

const pusher = new Pusher({
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  appId: process.env.PUSHER_APP_ID,
  secret: process.env.PUSHER_SECRET,
  encrypted: true,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data: EventData = req.body;

    pusher.trigger(data.room, "update", data);

    res.end();
  } catch (error) {
    res.status(500).send(error);
  }
};
