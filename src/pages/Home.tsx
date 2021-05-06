import React from "react";
import { customAlphabet } from "nanoid";
import { ArgentinaIcon, HeartIcon, NextIcon } from "@components/icons";
import { Input } from "@components/Input";
import { ROOM_REGEX, ROOM_INPUT_REGEX } from "@shared/room";

const roomGenerator = customAlphabet("0123456789", 5);

export default function HomePage() {
  return (
    <div className="w-full h-full flex justify-center items-center p-4">
      <div className="bg-gray-600 rounded-lg p-4 text-white">
        <div className="py-4">
          <h1 className="font-bold text-4xl text-center">WatchWith</h1>
          <p className="text-center text-sm leading-tight mt-1">
            Watch media from Youtube, Twitch, Facebook, direct files and more
            synchronously
          </p>
        </div>

        <div className="pt-8 pb-2">
          <button
            className="bg-white text-black font-bold py-2 w-full rounded-md transition-colors hover:bg-gray-200 focus:bg-gray-400 focus:outline-none"
            onClick={() => (location.href = `/${roomGenerator()}`)}
          >
            Create Room
          </button>
          <Input
            placeholder="Join Room"
            className="mt-4"
            inputRegex={ROOM_INPUT_REGEX}
            onSubmit={(room) => (location.href = `/${room}`)}
            validate={(room) => ROOM_REGEX.test(room)}
            icon={<NextIcon className="w-6 h-6" />}
          />
        </div>
      </div>

      <p className="absolute text-center bottom-2 w-full text-sm text-white cursor-default">
        <a href="https://github.com/JuanM04/watch-with" target="_blank">
          Made with
          <HeartIcon className="inline h-4 align-text-bottom px-1.5" />
          in
          <ArgentinaIcon className="inline h-4 align-text-bottom px-1.5" />
        </a>
      </p>
    </div>
  );
}
