import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";
import { RoomService } from "@roomservice/browser";
import { MapClient } from "@roomservice/browser/dist/MapClient";
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

function useMap(
  roomName: string,
  mapName: string
): [MapClient | undefined, Dispatch<SetStateAction<MapClient>>] {
  const [map, setMap] = useState<MapClient>();

  useEffect(() => {
    async function load() {
      const client = new RoomService({
        auth: "/api/roomservice",
      });
      const room = await client.room(roomName);
      const m = await room.map(mapName);
      setMap(m);

      room.subscribe(m, (mm) => setMap(mm));
    }
    if (typeof window !== "undefined") load();
  }, []);

  return [map, setMap];
}

export default function RoomPage() {
  const router = useRouter();
  const roomName = (router.query.room as string) || "debugroom";

  const [data, setData] = useMap(roomName, "playerData");
  const [lastTimeUpdateId, setLastTimeUpdateId] = useState<
    string | undefined
  >();

  const [urlInput, setUrlInput] = useState(
    data && data.get("url") ? (data.get("url") as string) : ""
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
      setLastTimeUpdateId(data.get("timeUpdateId") as string);
      playerRef.current?.seekTo(data.get("time") as number);
    }

    return (
      <>
        {data.get("url") !== undefined && (
          <ReactPlayer
            ref={playerRef}
            controls
            url={data.get("url") as string}
            playing={data.get("playing") === "true"}
            onPlay={() => setData(data.set("playing", "true"))}
            onPause={() => setData(data.set("playing", "false"))}
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
            setData(data.set("time", playerRef.current?.getCurrentTime()));
            setData(data.set("timeUpdateId", id));
          }}
        >
          Sync Time <SyncIcon style={{ marginLeft: "5px" }} size={16} />
        </Button>
      </>
    );
  }
}
