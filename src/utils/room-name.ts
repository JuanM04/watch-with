import { customAlphabet } from "nanoid";

export const ROOM_REGEX = /^\d{5}$/;
export const ROOM_INPUT_REGEX = /^\d{0,5}$/;

export const generateRoomName = customAlphabet("0123456789", 5);
