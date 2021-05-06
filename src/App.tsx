import React from "react";
import { ROOM_REGEX } from "@shared/room";
import { socket, SocketContext } from "@utils/socket";
import Home from "./pages/Home";
import Room from "./pages/Room";

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
    <SocketContext.Provider value={socket}>
      <div className="bg-gradient-to-t from-gray-900 via-gray-800 to-gray-900 h-screen">
        {inHome ? <Home /> : <Room />}
      </div>
    </SocketContext.Provider>
  );
}
