import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import ReactPlayer from "react-player";
import { RoomService, MapClient } from "@roomservice/browser";
import { v4 as uuidv4 } from "uuid";
import {
  Input,
  InputGroup,
  InputRightAddon,
  Spinner,
  Text,
  Button,
} from "@chakra-ui/core";
import { Play as PlayIcon, RefreshCw as SyncIcon } from "react-feather";

type Map = MapClient<string>;

function useMap(
  roomName: string,
  mapName: string
): [Map | undefined, Dispatch<SetStateAction<Map>>] {
  const [map, setMap] = useState<Map>();

  useEffect(() => {
    async function load() {
      const client = new RoomService({
        auth: "/api/roomservice",
      });
      const room = await client.room(roomName);
      const m = room.map<string>(mapName);
      setMap(m);

      room.subscribe(m, (mm) => setMap(mm));
    }
    if (typeof window !== "undefined") load();
  }, []);

  return [map, setMap];
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
  const [data, setData] = useMap(roomName, "playerData");
  const [lastTimeUpdateId, setLastTimeUpdateId] = useState<
    string | undefined
  >();

  const [urlInput, setUrlInput] = useState(
    data && data.get("url") ? data.get("url") : ""
  );

  const playerRef = useRef<ReactPlayer>(null);

  function handleInput() {
    if (ReactPlayer.canPlay(urlInput)) setData(data.set("url", urlInput));
    else alert("Invalid URL");
  }

  if (!data) {
    return <Spinner />;
  } else {
    if (lastTimeUpdateId !== data.get("timeUpdateId")) {
      setLastTimeUpdateId(data.get("timeUpdateId"));
      playerRef.current?.seekTo(parseFloat(data.get("time")));
    }

    return (
      <>
        {data.get("url") !== undefined && (
          <ReactPlayer
            ref={playerRef}
            controls
            url={data.get("url")}
            playing={data.get("playing") === "true"}
            onPlay={() => {
              if (data.get("playing") === "false")
                setData(data.set("playing", "true"));
            }}
            onPause={() => {
              if (data.get("playing") === "true")
                setData(data.set("playing", "false"));
            }}
          />
        )}
        <Text paddingTop="20px">
          <b>Share URL</b>: https://watchwith.juanm04.com/{roomName}
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

            const id = uuidv4();
            setLastTimeUpdateId(id);
            setData(
              data.set("time", playerRef.current?.getCurrentTime().toString())
            );
            setData(data.set("timeUpdateId", id));
          }}
        >
          Sync Time <SyncIcon style={{ marginLeft: "5px" }} size={16} />
        </Button>
      </>
    );
  }
}
