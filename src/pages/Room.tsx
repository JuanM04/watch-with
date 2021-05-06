import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactPlayer from "react-player";
import { Input } from "@components/Input";
import { LinkIcon, PlayIcon, SpinnerIcon } from "@components/icons";
import { SocketContext } from "@utils/socket";
import { copyToClipboard } from "@utils/copy";
import {
  RoomState,
  RoomEvent,
  roomStateSchema,
  roomStateMetadataSchema,
} from "@shared/room";

export default function RoomPage() {
  const roomName = location.pathname.substr(1);

  const socket = useContext(SocketContext);
  const playerRef = useRef<ReactPlayer | null>(null);

  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState<RoomState | null>(null);

  const updateRoom = useCallback(
    (event: RoomEvent) => socket.emit("updateServer", event),
    [socket]
  );

  useEffect(() => {
    socket.on("updateClient", (state, meta = {}) => {
      const data = roomStateSchema.parse(state);
      const metadata = roomStateMetadataSchema.parse(meta || {});

      setRoom(data);
      if (metadata.updateTime && data.url !== null) {
        playerRef.current?.seekTo(data.time);
      }
    });

    if (!connected) {
      socket.emit("join", roomName);
      setConnected(true);
    }
  }, [socket, connected, playerRef]);

  if (!connected || room === null) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <SpinnerIcon className="w-8 h-8 text-white" />
      </div>
    );
  }

  return (
    <div className="w-screen min-h-full bg-gray-900 text-white flex flex-col xl:flex-row">
      <section className="video-container bg-gray-700 xl:flex-grow">
        {room.url === null ? (
          <div className="flex flex-col justify-center items-center">
            <PlayIcon className="h-16 w-16" />
            <p className="text-sm text-center">
              Enter an URL to start playing some video!
            </p>
          </div>
        ) : (
          <ReactPlayer
            width="full"
            height="full"
            controls
            url={room.url}
            playing={room.playing}
            onPlay={() => updateRoom({ event: "play" })}
            onPause={() => {
              if (!playerRef.current) return;
              updateRoom({
                event: "pause",
                time: playerRef.current.getCurrentTime(),
              });
            }}
            onSeek={(time) => updateRoom({ event: "seek", time })}
            ref={playerRef}
          />
        )}
      </section>
      <section className="p-4 w-full xl:w-96">
        <h3 className="text-2xl font-bold">
          Room {roomName}{" "}
          <button
            className="inline text-gray-400 hover:text-gray-200 transition-colors focus:outline-none"
            onClick={() => copyToClipboard(location.href)}
          >
            <LinkIcon className="inline h-4 w-4" />
          </button>
        </h3>
        <p>
          Watching with <b>{room.watching}</b>{" "}
          {room.watching === 1 ? "person" : "people"}
        </p>
        <Input
          placeholder="Video URL"
          icon={<PlayIcon className="w-6 h-6" />}
          className="mt-8"
          validate={(url) => ReactPlayer.canPlay(url)}
          onSubmit={(url) => updateRoom({ event: "changeVideo", url })}
        />
      </section>
    </div>
  );
}
