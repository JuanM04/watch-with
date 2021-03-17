import type { VercelApiHandler } from "@vercel/node";
import cookie from "cookie";
import { nanoid } from "nanoid";
import fetch from "node-fetch";
import { ROOM_REGEX } from "@utils/room-id";

const USER_COOKIE = "user_id";
const USER_LENGTH = 14;

const roomserviceHandler: VercelApiHandler = async (req, res) => {
  let userId: string;

  if (
    typeof req.cookies[USER_COOKIE] === "string" &&
    req.cookies[USER_COOKIE].length === USER_LENGTH
  ) {
    userId = req.cookies[USER_COOKIE];
  } else {
    userId = nanoid(USER_LENGTH);
    res.setHeader(
      "Set-Cookie",
      cookie.serialize(USER_COOKIE, userId, {
        path: "/",
        sameSite: "strict",
        maxAge: 2147483647, // 2^31 - 1 (a.k.a never expire)
      })
    );
  }

  if (!ROOM_REGEX.test(req.body.room || "")) {
    res.status(400).send("Invalid room");
    return;
  }

  const r = await fetch("https://super.roomservice.dev/provision", {
    method: "POST",
    headers: {
      Authorization: `Bearer: ${
        process.env.ROOMSERVICE_KEY || "tcgCJ1_PunVCEU98O1QLX"
      }`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: userId,
      resources: [
        {
          object: "room",
          reference: req.body.room,
          permission: "join",
        },
      ],
    }),
  });

  return res.json(await r.json());
};

export default roomserviceHandler;
