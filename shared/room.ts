import { customAlphabet } from "nanoid";
import { z } from "zod";

export const ROOM_REGEX = /^\d{5}$/;
export const ROOM_INPUT_REGEX = /^\d{0,5}$/;

export const generateRoomName = customAlphabet("0123456789", 5);

const urlType = z.string().url();
const timeType = z.number().min(0);

export const roomStateSchema = z.object({
  url: urlType.nullable(),
  playing: z.boolean(),
  time: timeType,
  watching: z.number().int().min(1),
});

export const roomStateMetadataSchema = z
  .object({
    updateTime: z.boolean().default(false),
  })
  .nonstrict();

export const roomEventSchema = z.union([
  z.object({ event: z.literal("play") }),
  z.object({ event: z.literal("pause"), time: timeType }),
  z.object({ event: z.literal("seek"), time: timeType }),
  z.object({ event: z.literal("changeVideo"), url: urlType }),
]);

export type RoomState = z.infer<typeof roomStateSchema>;
export type RoomStateMetadata = z.infer<typeof roomStateMetadataSchema>;
export type RoomEvent = z.infer<typeof roomEventSchema>;
