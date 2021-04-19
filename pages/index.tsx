import { useState } from "react";
import Router from "next/router";
import { customAlphabet } from "nanoid";
import slugify from "slugify";
import {
  Button,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/core";
import { Check } from "react-feather";

const randomRoom = customAlphabet("abcdefghijklmnopqrstuvwxyz", 8);

export default function Homepage() {
  const [inputValue, setInputValue] = useState("");

  function handleCreate() {
    Router.push("/[room]", "/" + randomRoom());
  }

  function handleJoin() {
    let room = slugify(inputValue, { lower: true, remove: /[^\w ]+/g });
    if (room === "") alert("Inavlid room");

    Router.push("/[room]", `/${room}`);
  }

  return (
    <>
      <Heading as="h1" size="2xl">
        WatchWith
      </Heading>
      <Heading as="h2" size="sm" paddingBottom="30px">
        Watch media from Youtube, Twitch, Facebook, direct files and more
        synchronously
      </Heading>
      <Button onClick={handleCreate}>Create Room</Button>
      <InputGroup size="md" paddingTop="10px">
        <Input
          placeholder="Join Room"
          value={inputValue}
          isRequired
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleJoin();
          }}
        />
        <InputRightAddon
          children={<Check />}
          onClick={handleJoin}
          cursor="pointer"
        />
      </InputGroup>
    </>
  );
}