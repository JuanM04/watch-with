import { useState, useEffect, useRef } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import ReactPlayer from "react-player";
import { useMap, usePresence } from "@roomservice/react";
import { nanoid } from "nanoid";
import {
  Input,
  InputGroup,
  InputRightAddon,
  Spinner,
  Text,
  Button,
} from "@chakra-ui/core";
import { Play as PlayIcon, RefreshCw as SyncIcon } from "react-feather";

type PlayerData = {
  url: string | null;
  time: number;
  timeUpdateId: string;
  playing: boolean;
};

export const getServerSideProps: GetServerSideProps<{
  roomName: string;
}> = async (ctx) => {
  const room = ctx.params?.room;

  if (typeof room !== "string") {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      roomName: room,
    },
  };
};

export default function RoomPage({
  roomName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [playerData, playerMap] = useMap<PlayerData>(roomName, "playerData");
  const [watching, presence] = usePresence<boolean>(roomName, "watching");
  const [lastTimeUpdateId, setLastTimeUpdateId] = useState<
    string | undefined
  >();

  useEffect(() => {
    console.log(roomName);
    presence.set(true);
  }, []);

  const [urlInput, setUrlInput] = useState(playerData?.url || "");

  const playerRef = useRef<ReactPlayer>(null);

  function handleInput() {
    if (ReactPlayer.canPlay(urlInput) && playerMap) {
      playerMap.set("url", urlInput);
    } else {
      alert("Invalid URL");
    }
  }

  if (!playerData || !playerMap) {
    return <Spinner />;
  } else {
    if (playerMap.keys.length === 0) {
      playerMap.set("url", null);
      playerMap.set("time", 0);
      playerMap.set("timeUpdateId", "");
      playerMap.set("playing", false);
    }

    if (lastTimeUpdateId !== playerData.timeUpdateId) {
      setLastTimeUpdateId(playerData.timeUpdateId);
      playerRef.current?.seekTo(playerData.time);
    }

    return (
      <>
        {playerData.url !== null && (
          <ReactPlayer
            ref={playerRef}
            controls
            url={playerData.url}
            playing={playerData.playing}
            onPlay={() => !playerData.playing && playerMap.set("playing", true)}
            onPause={() =>
              playerData.playing && playerMap.set("playing", false)
            }
          />
        )}
        <Text paddingTop="20px">
          <b>Share URL</b>: https://watchwith.juanm04.com/{roomName}
        </Text>
        <Text>
          <b>Watching</b>: {Object.values(watching).filter(Boolean).length}
        </Text>
        <InputGroup size="md" paddingTop="20px">
          <Input
            placeholder="URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleInput()}
          />
          <InputRightAddon
            children={<PlayIcon />}
            onClick={handleInput}
            cursor="pointer"
          />
        </InputGroup>
        <Button
          size="md"
          marginTop="5px"
          onClick={() => {
            if (!playerRef.current) return;

            const id = nanoid();
            setLastTimeUpdateId(id);
            playerMap.set("time", playerRef.current?.getCurrentTime());
            playerMap.set("timeUpdateId", id);
          }}
        >
          Sync Time <SyncIcon style={{ marginLeft: "5px" }} size={16} />
        </Button>
      </>
    );
  }
}
