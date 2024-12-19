import { createContext } from "react";

export type TBlindBoxData = {
  id: string;
  url: string;
  bg?: string;
  color?: string;
  secretBoxData: {
    name?: string;
    url?: string;
  };
};

export type TActiveBlindBoxData = {
  width: number;
  height: number;
  top: number;
  left: number;
  id: string;
};

export type BlindBoxStatus = "OPENING" | "CLOSING" | "NONE";

export const BlindBoxContext = createContext<{
  openedBoxes: string[];
  openingBox?: TActiveBlindBoxData;
  status: BlindBoxStatus;
  getDataById: (id: string) => TBlindBoxData | undefined;
} | null>(null);
