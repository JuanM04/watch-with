import { MapClient, useMap, usePresence, useRoom } from "@roomservice/react";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Input } from "@components/Input";
import { LinkIcon, PlayIcon, SpinnerIcon } from "@components/icons";
import { copyToClipboard } from "./copy";

const DEBUG = true;

interface PlayerMap {
  url: string;
  playing: boolean;
  time: number;
}

const useSeekTime = (
  playerClient: MapClient<PlayerMap> | null,
  playerRef: ReactPlayer | null
) => {
  const [savedTime, setSavedTime] = useState(0);
  const time = playerClient?.get("time");

  if (time && time !== savedTime && playerRef) {
    setSavedTime(time);
    playerRef.seekTo(time);
  }

  return (time: number) => {
    setSavedTime(time);
    playerClient?.set("time", time);
  };
};

export default function RoomPage() {
  const roomName = location.pathname.substr(1);

  const room = useRoom(roomName);
  const [watching, watchingClient] = usePresence<boolean>(roomName, "watching");
  const [player, playerClient] = useMap<PlayerMap>(roomName, "player");

  const playerRef = useRef<ReactPlayer | null>(null);
  const seekTime = useSeekTime(playerClient || null, playerRef.current);

  useEffect(() => {
    const watchingInterval = setInterval(() => {
      watchingClient.set(true, 10);
    }, 5000);

    return () => clearInterval(watchingInterval);
  }, [watchingClient]);

  if (!room || !watching || !player || !watchingClient || !playerClient) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <SpinnerIcon className="w-8 h-8 text-white" />
      </div>
    );
  }

  const watchingCount = Object.entries(watching).filter(
    ([user, present]) => present && user !== room.me
  ).length;

  if (DEBUG) {
    console.group("Debug info");
    console.log("player", player);
    console.log("watching", watching);
    console.groupEnd();
  }

  return (
    <div className="w-screen min-h-full bg-gray-900 text-white flex flex-col xl:flex-row">
      <section className="video-container bg-gray-700 xl:flex-grow">
        {typeof player.url !== "string" ? (
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
            url={player.url}
            playing={player.playing}
            onPlay={() => playerClient.set("playing", true)}
            onPause={() => {
              playerClient.set("playing", false);
              if (playerRef.current) {
                seekTime(playerRef.current.getCurrentTime());
              }
            }}
            onSeek={seekTime}
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
          Watching with <b>{watchingCount}</b>{" "}
          {watchingCount === 1 ? "person" : "people"}
        </p>
        <Input
          placeholder="Video URL"
          icon={<PlayIcon className="w-6 h-6" />}
          className="mt-8"
          validate={(url) => ReactPlayer.canPlay(url)}
          onSubmit={(url) => {
            playerClient.set("url", url);
            playerClient.set("playing", false);
            playerClient.set("time", 0);
          }}
        />
      </section>
    </div>
  );
}
