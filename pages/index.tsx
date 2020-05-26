import { useState } from "react";
import Router from "next/router";
import slugify from "slugify";
import { Heading, Input, InputGroup, InputRightAddon } from "@chakra-ui/core";
import { Check } from "react-feather";

export default () => {
  const [inputValue, setInputValue] = useState("");

  function handleInput() {
    let slug = slugify(inputValue, { lower: true, remove: /[^\w ]+/g });
    let room = slug !== "" ? slug : Math.random().toString(36).substring(7);

    Router.push("/[room]", `/${room}?host=true`);
  }

  return (
    <>
      <Heading as="h1" size="2xl">
        WatchWith
      </Heading>
      <Heading as="h2" size="sm">
        Watch media from Youtube, Twitch, Facebook, direct files and more
        synchronously
      </Heading>
      <InputGroup size="md" paddingTop="30px">
        <Input
          placeholder="Create room"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleInput();
          }}
        />
        <InputRightAddon
          children={<Check />}
          onClick={handleInput}
          cursor="pointer"
        />
      </InputGroup>
    </>
  );
};
