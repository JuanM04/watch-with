import React from "react";
import { ROOM_REGEX } from "@utils/room-name";
import Home from "./pages/Home";
import Room from "./pages/Room";
import RoomWrapper from "./pages/Room/wrapper";

export default function App() {
  const path = location.pathname.substr(1); // removes first `/`
  let inHome = true;

  if (path.length > 0) {
    if (path.match(ROOM_REGEX)) {
      inHome = false;
    } else {
      location.replace("/");
    }
  }

  return (
    <div className="bg-gradient-to-t from-gray-900 via-gray-800 to-gray-900 h-screen">
      {inHome ? (
        <Home />
      ) : (
        <RoomWrapper>
          <Room />
        </RoomWrapper>
      )}
    </div>
  );
}
