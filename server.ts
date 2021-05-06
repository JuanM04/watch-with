import express from "express";
import { Server as SocketIO } from "socket.io";
import path from "path";
import http from "http";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import {
  roomEventSchema,
  RoomState,
  RoomStateMetadata,
  ROOM_REGEX,
} from "./shared/room";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;

const io = new SocketIO(server);

const dbAdapter = new FileSync<Record<string, RoomState>>("db.json", {
  defaultValue: {},
});
const db = low(dbAdapter);

io.on("connection", (socket) => {
  socket.on("join", (roomName) => {
    if (typeof roomName !== "string" || !ROOM_REGEX.test(roomName)) return;

    const updateRoom = (room: RoomState, metadata?: RoomStateMetadata) => {
      db.set(roomName, room).write();
      io.to(roomName).emit("updateClient", room, metadata);
    };

    socket.join(roomName);

    if (db.has(roomName).value()) {
      const room = db.get(roomName).value();
      updateRoom({ ...room, watching: room.watching + 1 });
    } else {
      updateRoom({ url: null, watching: 1, playing: false, time: 0 });
    }

    socket.on("updateServer", (e) => {
      const result = roomEventSchema.safeParse(e);
      if (!result.success) return;

      const event = result.data;
      const room = db.get(roomName).value();

      switch (event.event) {
        case "play":
          updateRoom({ ...room, playing: true });
          break;

        case "pause":
          updateRoom(
            { ...room, playing: false, time: event.time },
            { updateTime: true }
          );
          break;

        case "seek":
          updateRoom({ ...room, time: event.time }, { updateTime: true });
          break;

        case "changeVideo":
          updateRoom(
            { ...room, url: event.url, playing: false, time: 0 },
            { updateTime: true }
          );
          break;

        default:
          break;
      }
    });

    socket.on("disconnect", () => {
      const room = db.get(roomName).value();
      if (room.watching === 1) {
        db.unset(roomName).write();
      } else {
        updateRoom({ ...room, watching: room.watching - 1 });
      }
    });
  });
});

app.use("/", express.static(path.resolve("./dist/")));

app.use("*", async (req, res) => {
  const url = req.originalUrl.split("?", 2)[0];

  if (/^\/\d*$/.test(url)) {
    res.sendFile(path.resolve("./dist/index.html"));
  } else {
    res.status(404).send("Not found");
  }
});

server.listen(port);
