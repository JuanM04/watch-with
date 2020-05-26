import { useState, useEffect, useRef } from "react";
import { GetServerSideProps } from "next";
import ReactPlayer from "react-player";
import {
  Input,
  InputGroup,
  InputRightAddon,
  Spinner,
  Text,
  Button,
} from "@chakra-ui/core";
import { Play } from "react-feather";

type _Props = {
  room: string;
  isHost: boolean;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const props: _Props = {
    room: ctx.params.room as string,
    isHost: ctx.query.host === "true",
  };

  return { props };
};

export default ({ room, isHost }: _Props) => {
  const [data, setData] = useState<EventData>({
    room,
    url: "",
    isPause: false,
    time: null,
  });
  const [urlInput, setUrlInput] = useState("");
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (typeof window === "undefined" || isHost) return;

    const Pusher = import("pusher-js/with-encryption").then(
      ({ default: Pusher }) => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
        });

        const channel = pusher.subscribe(room);
        channel.bind("update", (newData: EventData) => {
          if (newData.time && playerRef.current && data.time !== newData.time) {
            playerRef.current.seekTo(newData.time);
          }
          setData(newData);
        });
      }
    );
  }, []);

  function update(data: EventData) {
    data = playerRef.current
      ? { ...data, time: playerRef.current.getCurrentTime() }
      : data;
    setData(data);

    fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  function handleInput() {
    if (ReactPlayer.canPlay(urlInput)) update({ ...data, url: urlInput });
    else alert("Invalid URL");
  }

  return (
    <>
      {data.url !== "" ? (
        <ReactPlayer
          ref={playerRef}
          controls
          url={data.url}
          playing={!data.isPause}
          onPlay={() => isHost && update({ ...data, isPause: false })}
          onPause={() => isHost && update({ ...data, isPause: true })}
          onSeek={(time) => isHost && update({ ...data, time })}
        />
      ) : isHost ? (
        <InputGroup size="md" paddingTop="30px">
          <Input
            placeholder="URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleInput();
            }}
          />
          <InputRightAddon
            children={<Play />}
            onClick={handleInput}
            cursor="pointer"
          />
        </InputGroup>
      ) : (
        <Spinner />
      )}
      <Text paddingTop="20px">
        <b>Share URL</b>: https://watchwith.juanm04.com/{room}
      </Text>
      <Text>
        <b>Role</b>: {isHost ? "Host" : "Viewer"}
      </Text>
    </>
  );
};
