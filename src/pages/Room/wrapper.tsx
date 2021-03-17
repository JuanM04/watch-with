import React from "react";
import { RoomServiceProvider } from "@roomservice/react";

export default function RoomWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoomServiceProvider
      clientParameters={{
        ctx: {},
        auth: async (params) => {
          const response = await fetch("/api/roomservice", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              room: params.room,
            }),
          });

          const body = await response.json();
          return body;
        },
      }}
    >
      {children}
    </RoomServiceProvider>
  );
}
